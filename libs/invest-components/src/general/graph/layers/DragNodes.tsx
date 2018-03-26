import * as React from 'react'
import { GraphChild } from '../Graph'

class DragNodes extends React.Component<GraphChild> {

    dragListener: {
        bind(eventName: string, handler: {}): void
    }

    componentDidMount() {
        const { graph } = this.props
        const s = this.props.sigma

        if (s != null && graph != null && sigma.plugins.dragNodes) {

            this.dragListener = sigma.plugins.dragNodes(s, s.renderers[0])
            this.dragListener.bind('startdrag', function (event: {}) {
                s.stopForceAtlas2()
            })
            this.dragListener.bind('drag', function (event: {}) {
                // Ignore
            })
            this.dragListener.bind('drop', function (event: {}) {
                // Ignore
            })
            this.dragListener.bind('dragend', function (even: {}) {
                // graph.layout()
                // NOTE: Don't layout
            })

        } else {
            console.error('Unable to initialise dragNodes, plugin missing?')
        }
    }

    render() {
        return null
    }
}

export default DragNodes