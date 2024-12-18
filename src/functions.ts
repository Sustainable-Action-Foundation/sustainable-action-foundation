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
    interval?: never; 
};

type NonIdParams = BaseParams & { 
    id?: never; 
    sort?: string; 
    filter?: string; 
    expand?: string;
    interval?: { start: number; end: number }; 
};

type PocketBaseParams = IdExclusiveParams | NonIdParams;


const pb = new PocketBase('https://sustainable-action-foundation.pockethost.io/');

/**
 * Gets data from pocketbase
 * @param collection - Collection name
 * @param id - The ID of a specific element
 * @param sort - PocketBase sorting string
 * @param filter - PocketBase filter string
 * @param expand - Relation to expand
 * @param interval - Gets a range of records 
*/

export async function pbFetch(params: PocketBaseParams): Promise<any> { 
    await pb.admins.authWithPassword(import.meta.env.PB_USERNAME, import.meta.env.PB_PASSWORD);

    const { collection, id, sort, filter, expand, interval } = params;
    const options: any = {};

    if (sort) options.sort = sort;
    if (filter) options.filter = filter;
    if (expand) options.expand = expand

    try {
        const collectionRef = pb.collection(collection);

        if (id) {
            return await collectionRef.getOne(id, options);
        } 

        if (interval) {
            return (await collectionRef.getList(interval.start, interval.end, options)).items;
        }

        // Default to fetch full list with sorting
        return await collectionRef.getFullList(options);
    } catch (error) {
        console.error("Error fetching data from PocketBase:", error);
        throw new Error("An error occurred while fetching data. Please try again.");
    } 
    finally {
        pb.authStore.clear();
    }
}


/**
 * Removes html tags from a string
 * @param htmlString - A string which contains html tags
*/

export function removeTags(htmlString: string) {
    if ((htmlString === null) || (htmlString === ''))
        return false;
    else
        htmlString = htmlString.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return htmlString.replace(/(<([^>]+)>)/ig, '');
}