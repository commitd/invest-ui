export type SigmaEvent<T> = {
    data: T,
    captor?: {}
}

export type SigmaClickNodeEvent = SigmaEvent<{
    node: SigmaJs.Node
}>

export type SigmaClickNodesEvent = SigmaEvent<{
    nodes: SigmaJs.Node[]
}>

export type SigmaClickEdgeEvent = SigmaEvent<{
    edge: SigmaJs.Edge
}>

export type SigmaClickEdgesEvent = SigmaEvent<{
    edges: SigmaJs.Edge[]
}>

// TODO: There are more Sigma events to be exposed as needed