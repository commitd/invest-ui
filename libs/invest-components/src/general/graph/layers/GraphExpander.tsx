import * as React from 'react'
import { GraphHelper } from '../GraphHelper'
import { GraphChild } from '../Graph'
import { SigmaClickNodeEvent, SigmaClickEdgeEvent } from '../Events'

export type Props = GraphChild & {
    onNodeExpand?(node: SigmaJs.Node, helper: GraphHelper): void
    onEdgeExpand?(edge: SigmaJs.Edge, helper: GraphHelper): void
}

class SigmaGraphExpander extends React.Component<Props> {

    constructor(props: Props) {
        super(props)

    }

    componentDidMount() {
        const { sigma, graph } = this.props

        if (sigma != null && graph != null) {
            sigma.bind('doubleClickNode', (e: SigmaClickNodeEvent) => {
                if (e.data.node != null && this.props.onNodeExpand) {
                    this.props.onNodeExpand(e.data.node, graph)
                }
            })

            sigma.bind('doubleClickEdge', (e: SigmaClickEdgeEvent) => {
                if (e.data.edge != null && this.props.onEdgeExpand) {
                    this.props.onEdgeExpand(e.data.edge, graph)
                }
            })
        }
    }

    render() {
        return null
    }
}

export default SigmaGraphExpander