import * as React from 'react'

import { Handler, Connection } from 'vessel-rpc'
import { UiPlugin } from 'vessel-types'
import IFrame from './IFrame'

export interface Props {
    plugin: UiPlugin
    globalHandler: Handler<{}>
    hide?: boolean
}

class PluginView extends React.Component<Props> {

    handler: Handler<{}>
    connection: Connection<{}>

    constructor(props: Props) {
        super(props)

        // TODO: Add any per iframe functions here
        this.handler = this.props.globalHandler
    }

    handleLoad = (connection: Connection<{}>) => {
        this.connection = connection
        this.connection.notify('onLoad')
        this.connection.notify('onShow')
    }

    componentWillUnmount() {
        if (this.connection) {
            this.connection.notify('onHide')
            this.connection.notify('onUnload')
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.hide !== this.props.hide && this.connection) {
            if (this.props.hide) {
                this.connection.notify('onHide')
            } else {
                this.connection.notify('onShow')
            }
        }
    }

    render() {
        const { plugin, hide } = this.props
        return (
            <IFrame src={plugin.url} handler={this.handler} hide={hide} onLoad={this.handleLoad} />
        )
    }
}

export default PluginView