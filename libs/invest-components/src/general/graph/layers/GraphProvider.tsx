import * as React from 'react'

export type SigmaProps = {
    sigma?: SigmaJs.Sigma
    onSigma?(sigma: SigmaJs.Sigma): void
    onGraph?(graph: SigmaJs.Graph): void
}

class SigmaGraphProvider extends React.Component<SigmaProps> {

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
        if (this.props.onSigma) {
            this.props.onSigma(sigma)
        }

        if (this.props.onGraph) {
            this.props.onGraph(sigma.graph)
        }
    }

    render() {
        return null
    }
}

export default SigmaGraphProvider