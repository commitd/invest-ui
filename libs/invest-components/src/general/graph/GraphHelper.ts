export interface GraphHelper {

    addNode(n: SigmaJs.Node): void

    addEdge(e: SigmaJs.Edge): void

    dropNode(n: SigmaJs.Node): void

    dropEdge(e: SigmaJs.Edge): void

    refresh(): void

    layout(timeout?: number): void

    nodes(): SigmaJs.Node[]

    edges(): SigmaJs.Edge[]

    clear(): void

    findNode(id: string): SigmaJs.Node | undefined

    findEdge(id: string): SigmaJs.Edge | undefined
}

export class SigmaGraphHelper implements GraphHelper {
    private sigma: SigmaJs.Sigma
    private graph: SigmaJs.Graph

    constructor(sigma: SigmaJs.Sigma) {
        this.sigma = sigma
        this.graph = sigma.graph
    }

    clear = () => {
        this.graph.clear()
    }

    addNode = (n: SigmaJs.Node) => {
        if (n.x == null || n.x === 0) {
            n.x = Math.random() * 50
        }
        if (n.y == null || n.y === 0) {
            n.y = Math.random() * 50
        }
        if (n.size == null) {
            n.size = 15
        }
        this.graph.addNode(n)
    }

    addEdge = (e: SigmaJs.Edge) => {
        if (e.size == null) {
            e.size = 1
        }
        this.graph.addEdge(e)
    }

    dropNode = (n: SigmaJs.Node) => {
        this.graph.dropNode(n.id)
    }

    dropEdge = (e: SigmaJs.Edge) => {
        this.graph.dropEdge(e.id)
    }

    nodes = () => this.graph.nodes()

    edges = () => this.graph.edges()

    refresh = () => {
        this.sigma.refresh()
    }

    layout = (timeout?: number) => {
        // Don't know if I need to so this in order to pick up the new nodes and edges?
        if (this.sigma.killForceAtlas2 != null) {
            this.sigma.killForceAtlas2()

            if (!this.sigma.isForceAtlas2Running()) {
                this.sigma.startForceAtlas2()
                const runtime = timeout !== undefined ? timeout : Math.min(2000, this.graph.nodes().length * 10)
                setTimeout(() => this.sigma.stopForceAtlas2(), runtime)
            }
        }
    }

    findNode = (id: string): SigmaJs.Node | undefined => {
        return this.nodes().find(n => n.id === id)
    }

    findEdge = (id: string): SigmaJs.Edge | undefined => {
        return this.edges().find(e => e.id === id)
    }
}
