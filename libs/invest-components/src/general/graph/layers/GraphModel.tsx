import * as React from 'react'
import { GraphChild } from '../Graph'
import GraphNode from './GraphNode'
import GraphEdge from './GraphEdge'

class GraphModel extends React.Component<GraphChild> {

    render() {
        const { sigma, graph } = this.props

        if (sigma == null || graph == null) {
            return null
        }

        if (this.props.children == null) {
            return null
        }
        const nodes = sigma.graph.nodes()
        const edges = sigma.graph.edges()

        let changes: number = 0

        const array = React.Children.toArray(this.props.children)

        const nodeChildren: React.ReactElement<SigmaJs.Node>[] = array.filter(a => {
            const c = a as React.ReactElement<{}>
            return c.type === GraphNode
        }).map(a => a as React.ReactElement<SigmaJs.Node>)

        const edgeChildren: React.ReactElement<SigmaJs.Edge>[] = array.filter(a => {
            const c = a as React.ReactElement<{}>
            return c.type === GraphEdge
        }).map(a => a as React.ReactElement<SigmaJs.Edge>)

        // Deal with nodes

        const nodesIds: string[] = []

        nodeChildren.forEach(c => {
            // const key = c.key
            const props = c.props as SigmaJs.Node
            const id = c.props.id

            nodesIds.push(id)

            if (!nodes.find(n => n.id === id)) {
                const { children, ...node } = props
                graph.addNode(node)
                changes++
            }
        })

        // Remove nodes that are no long in our children
        const nodesToRemove = sigma.graph.nodes()
            .filter(n => !nodesIds.find(id => id === n.id))
        if (nodesToRemove.length > 0) {
            changes += nodesToRemove.length
            nodesToRemove.forEach(n => graph.dropNode(n))
        }

        // Deal with edges

        const edgesIds: string[] = []

        edgeChildren.forEach(c => {
            // const key = c.key
            const props = c.props as SigmaJs.Edge
            const id = c.props.id

            edgesIds.push(id)

            if (!edges.find(e => e.id === id)) {
                const { children, ...edge } = props
                graph.addEdge(edge)
                changes++

            }

        })

        const edgesToRemove = sigma.graph.edges()
            .filter(e => !edgesIds.find(id => id === e.id))
        if (edgesToRemove.length > 0) {
            changes += edgesToRemove.length
            edgesToRemove.forEach(e => graph.dropEdge(e))
        }

        // TODO: if node or edge found, then check if the key is the same and not not then replace

        if (changes > 0) {
            sigma.refresh()

            graph.layout(Math.max(2000, changes * 50))
        }

        return null
    }
}

export default GraphModel