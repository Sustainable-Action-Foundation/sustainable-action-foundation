import PocketBase from 'pocketbase';

// TODO: Prly wanna rename theese types (chatgpt generated names)
// TODO: See if pocketbase options already exist as a defined type somewhere
interface BaseParams {
    collection: string;
}

type IdExclusiveParams = BaseParams & { 
    id: string; 
    sort?: never; 
    filter?: never; 
    expand?: string;
    list_options?: never; 
};

type NonIdParams = BaseParams & { 
    id?: never; 
    sort?: string; 
    filter?: string; 
    expand?: string;
    list_options?: { page: number; perPage: number }; 
};

type PocketBaseParams = IdExclusiveParams | NonIdParams;


const pb = new PocketBase(import.meta.env.PB_URL);
let authEndpoint: string | null = null;
let authPromise: Promise<void> | null = null;

async function authenticateSuperuser(identity: string, password: string) {
    const base = (import.meta.env.PB_URL ?? '').replace(/\/$/, '');
    const payload = JSON.stringify({ identity, password });
    const headers = { 'Content-Type': 'application/json' };

    const endpoints = authEndpoint
        ? [authEndpoint]
        : [
            `${base}/api/admins/auth-with-password`,
            `${base}/api/collections/_superusers/auth-with-password`,
        ];

    let lastError: any = null;

    for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: payload,
        });

        const data: any = await response.json().catch(() => ({}));

        // 404 means this PB version doesn't expose this endpoint; try next fallback.
        if (response.status === 404) {
            lastError = data;
            continue;
        }

        if (!response.ok || !data?.token) {
            throw new Error(data?.message ?? `PocketBase auth failed with status ${response.status}`);
        }

        authEndpoint = endpoint;
        pb.authStore.save(data.token, data.record ?? null);
        return;
    }

    throw new Error(lastError?.message ?? 'PocketBase auth endpoint not found');
}

/**
 * Gets data from pocketbase
 * @param collection - Collection name
 * @param id - The ID of a specific element
 * @param sort - PocketBase sorting string
 * @param filter - PocketBase filter string
 * @param expand - Relation to expand
 * @param interval - Gets a range of records 
*/

{/* TOOD: return an actual type */}
export async function pbFetch(params: PocketBaseParams): Promise<any> { 
    const { collection, id, sort, filter, expand, list_options } = params;
    const options: any = {};

    if (sort) options.sort = sort;
    if (filter) options.filter = filter;
    if (expand) options.expand = expand

    try {
        if (!import.meta.env.PB_URL) {
            console.warn('PB_URL not set — skipping PocketBase request and returning empty result');
            return [];
        }

        // Attempt admin auth only when credentials are provided.
        // If credentials are present but auth fails, fail fast so CI surfaces the real issue.
        if (import.meta.env.PB_USERNAME && import.meta.env.PB_PASSWORD) {
            try {
                if (!pb.authStore.isValid) {
                    authPromise ??= authenticateSuperuser(import.meta.env.PB_USERNAME, import.meta.env.PB_PASSWORD).finally(() => {
                        authPromise = null;
                    });

                    await authPromise;
                }
            } catch (authErr) {
                console.error('PocketBase admin auth failed', authErr instanceof Error ? authErr.message : authErr);
                throw new Error('PocketBase admin authentication failed. Verify PB_URL, PB_USERNAME, and PB_PASSWORD.');
            }
        } else {
            console.warn('PB_USERNAME or PB_PASSWORD not set — proceeding without admin auth');
        }

        const collectionRef = pb.collection(collection);

        if (id) {
            return await collectionRef.getOne(id, options);
        }

        if (list_options) {
            return (await collectionRef.getList(list_options.page, list_options.perPage, options));
        }

        // Default to fetch full list with sorting
        return await collectionRef.getFullList(options);
    } catch (error) {
        console.error("Error fetching data from PocketBase:", error);
        if (list_options) {
            return {
                page: list_options.page,
                perPage: list_options.perPage,
                totalItems: 0,
                totalPages: 0,
                items: [],
            };
        }
        return [];
    } 
}


/**
 * Removes html tags from a string
 * @param htmlString - A string which contains html tags
*/

// TODO: There is probably a better way to do this
export function removeTags(htmlString: string) {
    if (!htmlString) return '';

    // Remove HTML tags
    const withoutTags = htmlString.replace(/(<([^>]+)>)/gi, '');

    // Decode common HTML entities (extend this as needed)
    const entityMap: Record<string, string> = {
        '&auml;': 'ä',
        '&ouml;': 'ö',
        '&uuml;': 'ü',
        '&Auml;': 'Ä',
        '&Ouml;': 'Ö',
        '&Uuml;': 'Ü',
        '&amp;': '&',
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
    };

    return withoutTags.replace(/&[a-z]+;/gi, (entity) => entityMap[entity] || entity);
}
