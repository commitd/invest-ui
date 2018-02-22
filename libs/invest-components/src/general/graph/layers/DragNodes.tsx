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
                // console.log(event)
            })
            this.dragListener.bind('drag', function (event: {}) {
                // console.log(event)
            })
            this.dragListener.bind('drop', function (event: {}) {
                // console.log(event)
            })
            this.dragListener.bind('dragend', function (even: {}) {
                // console.log(event)
                // graph.layout()
                // NOTE: Don't layout
            })

            // console.log('drag enabled')
            // console.log(this.dragListener)
        } else {
            console.error('Unable to initialise dragNodes, plugin missing?')
        }
    }

    render() {
        return null
    }
}

export default DragNodes