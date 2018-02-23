import * as React from 'react'
import SigmaGraphExpander from './layers/GraphExpander'
import { GraphHelper } from './GraphHelper'
import Graph from './Graph'
import GraphModel from './layers/GraphModel'
import GraphNode from './layers/GraphNode'
import GraphEdge from './layers/GraphEdge'
import DragNodes from './layers/DragNodes'
import GraphProvider from './layers/GraphProvider'
import SelectionProvider from './layers/SelectionProvider'

export type OwnProps = {
    graph: SigmaJs.GraphData
    settings?: SigmaJs.Settings
    onNodeExpand?(node: SigmaJs.Node, helper: GraphHelper): void
    onEdgeExpand?(edge: SigmaJs.Edge, helper: GraphHelper): void
    onNodeSelect?(node: SigmaJs.Node): void
    onEdgeSelect?(edge: SigmaJs.Edge): void
    onSigma?(sigma: SigmaJs.Sigma): void
}

export type Props = OwnProps

type State = {
    graphKey: string
}

class SigmaGraph extends React.Component<Props, State> {

    state: State

    constructor(props: Props) {
        super(props)

        this.state = {
            graphKey: JSON.stringify(props.graph)
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.graph !== this.props.graph) {

            this.setState({
                graphKey: JSON.stringify(nextProps.graph)
            })

        }
    }

    shouldComponentUpdate(nextProps: Props) {
        return nextProps.graph !== this.props.graph
    }

    render() {
        const { onSigma } = this.props

        return (
            <Graph
                key={this.state.graphKey}
                settings={this.props.settings}
                // TODO: Perhaps pick renderer based on the number of nodes?
                renderer="canvas"
            >
                <SigmaGraphExpander
                    onEdgeExpand={this.props.onEdgeExpand}
                    onNodeExpand={this.props.onNodeExpand}
                />
                <GraphProvider onSigma={onSigma} />
                <SelectionProvider onEdgeSelected={this.props.onEdgeSelect} onNodeSelected={this.props.onNodeSelect} />
                <GraphModel>
                    {this.props.graph.nodes.map(n =>
                        <GraphNode key={n.id} {...n} />
                    )}
                    {this.props.graph.edges.map(e =>
                        <GraphEdge key={e.id} {...e} />
                    )}
                </GraphModel>
                <DragNodes />
            </Graph>

        )
    }
}

export default SigmaGraph as React.ComponentType<Props>
