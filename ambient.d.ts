type Route = { 
    text: string, 
    href: string, 
    subroutes?: Array<{text: string, href: string}>  
}

type pbCollection = {
    page: number,
    perPage: number,
    totalItems: number,
    totalPages: number,
    items: Array<Person> | Array<Article> | Array<Program> | Array<Project>,
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
    employed?: boolean
}

type Article = pbItem & {
    banner?: string,
    title: string,
    author: Person.id,
    published_date: Date,
    text: string,
    preview?: string,
}

type Program = pbItem & {
    image?: string,
    title: string,
    description: string,
    preview?: string,
}

type Project = pbItem & {
    title: string,
    program: Program.id,
    start_date: Date,
    end_date: Date
}