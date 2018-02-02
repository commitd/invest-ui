import * as React from 'react'
import { SigmaClickNodeEvent, SigmaClickEdgeEvent } from '../Events'

export type SigmaProps = {
    sigma?: SigmaJs.Sigma
    onNodeSelected?(node: SigmaJs.Node): void
    onEdgeSelected?(edge: SigmaJs.Edge): void
}

class SigmaSelectionProvider extends React.Component<SigmaProps> {

    componentWillReceiveProps(nextProps: SigmaProps) {
        if (this.props.sigma !== nextProps.sigma && nextProps.sigma != null) {
            this.update(nextProps.sigma)
        }
    }

    componentDidMount() {
        if (this.props.sigma != null) {
            this.update(this.props.sigma)
        }
    }

    update = (sigma: SigmaJs.Sigma) => {
        sigma.bind('clickNode', (e: SigmaClickNodeEvent) => {
            if (e.data.node != null && this.props.onNodeSelected) {
                this.props.onNodeSelected(e.data.node)
            }
        })

        sigma.bind('clickEdge', (e: SigmaClickEdgeEvent) => {
            if (e.data.edge != null && this.props.onEdgeSelected) {
                this.props.onEdgeSelected(e.data.edge)
            }
        })
    }

    render() {
        return null
    }
}

export default SigmaSelectionProvider