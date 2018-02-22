import * as React from 'react'
import { GraphHelper, SigmaGraphHelper } from './GraphHelper'
import GraphModel from './layers/GraphModel'

/* If you want to use this you need in your webpack to include this code, which will install install sigma into global
space and add the plugins.
const sigma = require('sigma')
const g = window as { sigma?: SigmaJs.Sigma }
g.sigma = sigma
require('imports-loader?sigma,this=>window!sigma/build/plugins/sigma.plugins.dragNodes.min.js')
require('imports-loader?sigma,this=>window!sigma/build/plugins/sigma.layout.forceAtlas2.min.js')
*/

export interface GraphChild {
    sigma?: SigmaJs.Sigma,
    graph?: GraphHelper,
}

interface GraphChildSet {
    sigma: SigmaJs.Sigma,
    graph: GraphHelper,
}

export interface GraphProps {
    settings?: SigmaJs.Settings
    renderer?: 'canvas' | 'webgl'
    children: React.ReactElement<GraphModel>[]
}

class Graph extends React.Component<GraphProps> {

    sigma: SigmaJs.Sigma
    renderer?: SigmaJs.Renderer
    helper: GraphHelper
    container?: HTMLDivElement

    constructor(props: GraphProps) {
        super(props)
        // Once set, settings can't be changed
        this.sigma = new sigma({
            settings: props.settings
        })
        this.helper = new SigmaGraphHelper(this.sigma)
    }

    handleRef = (container: HTMLDivElement) => {

        console.log('hmm')
        if (this.renderer) {
            this.sigma.killRenderer(this.renderer)
            this.renderer = undefined
        }

        if (container && this.container !== container) {
            this.container = container

            this.renderer = this.sigma.addRenderer({
                type: this.props.renderer,
                container: container
            })

            // We tell react to rerender us (we can do something with our children now)
            this.forceUpdate()
        }
    }

    componentWillUnmount() {
        this.sigma.kill()
    }

    render() {

        const { children } = this.props
        const withSigmaChildren = this.renderer ?
            React.Children.map(children, (child: React.ReactElement<GraphChildSet>) => {
                if (child == null) {
                    return null
                }
                return React.cloneElement(child, { sigma: this.sigma, graph: this.helper })
            })
            : []

        return (
            <div
                style={{ width: '100%', height: '100%' }}
                ref={this.handleRef}
            >
                {withSigmaChildren}
            </div>
        )
    }
}

export default Graph