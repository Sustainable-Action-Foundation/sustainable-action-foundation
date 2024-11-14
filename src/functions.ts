import PocketBase from 'pocketbase';

interface PocketBaseParams {
    collection: string;
    id?: string;
    sort?: string;
    interval?: {start: number, end: number};
}

const pb = new PocketBase('https://sustainable-action-foundation.pockethost.io/');

/**
 * Gets data from pocketbase
 * @param collection - The collection from which to get data
 * @param id - The ID of a specific element
 * @param sort - Pocketbase sorting string
 * @param interval - Get specific amount of records (starts at 1) 
*/

export async function pbFetch(params: PocketBaseParams): Promise<any> {
    await pb.admins.authWithPassword(import.meta.env.PB_USERNAME, import.meta.env.PB_PASSWORD);
    
    const { collection, id, sort, interval } = params;

    if (id) {
        const data = await pb.collection(collection).getOne(id)
        pb.authStore.clear();
        
        return data
    }

    if (interval) {
        const data = await pb.collection(collection).getList(interval.start, interval.end, {
            sort: sort
        }) 
        pb.authStore.clear();

        return data.items
    }
    
    const data = await pb.collection(collection).getFullList({
        sort: sort
    });

    pb.authStore.clear();
  
    return data
  
}

