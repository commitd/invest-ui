export type Action = {
    action: string
    title: string
    description: string
}

export type Plugin = {
    id: string,
    name: string,
    description: string,
    actions: Action[]
}