import * as React from 'react'

import { Handler, Connection } from 'vessel-rpc'
import { UiPlugin } from 'vessel-types'
import IFrame from './IFrame'

export interface Props {
    plugin: UiPlugin
    globalHandler: Handler<{}>
    hide?: boolean
}

// TODO The iframe stakes a http://localhost:8080 which is ok, but what ist ehv alue of it
// window.location.hostname? That doesn;t work in dev mode with webpack . It might have to come from the server / config? And if null then fallback
const baseServerPath = 'http://localhost:8080'

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
        const url = this.generateAbsoluteUrl(plugin.url)
        return (
            <IFrame src={url} handler={this.handler} hide={hide} onLoad={this.handleLoad} />
        )
    }

    private generateAbsoluteUrl(relativeUrl: string) {
        if (relativeUrl.startsWith('http')) {
            return relativeUrl
        } else {
            return baseServerPath + relativeUrl
        }
    }
}

export default PluginView