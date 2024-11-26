type Route = { 
    text: string, 
    href: string, 
    subroutes?: Array<{text: string, href: string}>  
}

type pbItem = {
    collectionId: string,
    collectionName: string, 
    created: Date,
    updated: Date,
    id: string,
    expand?: any /* TODO: How does typing work for this?  */
}

type Person = pbItem &  {
    portrait?: string,
    name: string,
    role: string,
    email?: string,
    phone?: string,
}

type Article = pbItem & {
    banner?: string,
    title: string,
    author: Person,
    published_date: Date,
    text: string,
    preview?: string,
}