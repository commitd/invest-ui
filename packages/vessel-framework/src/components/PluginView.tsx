import * as React from 'react'

import { Handler, Connection } from 'vessel-rpc'
import { PluginWithIntent } from 'vessel-types'
import IFrame from './IFrame'
const isEqual = require('lodash.isequal')

export interface Props {
    /** The plugin (with intent) to display */
    plugin: PluginWithIntent
    /** Handler to pass messages up to */
    globalHandler: Handler<{}>
    /** Should this plugin view be hidden */
    hide?: boolean
}

// TODO The iframe stakes a http://localhost:8080 which is ok, but what ist ehv alue of it
// window.location.hostname? That doesn;t work in dev mode with webpack . It might have to come from the server / config? And if null then fallback
const baseServerPath = 'http://localhost:8080'

/**
 * A wrapper for displaying a plugin.
 * 
 * Provides messaging support and controls the iframe in which the plugin will be displayed.
 */
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
        this.sendAction()

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

        // If the action has changed, then we need to tell the plugin
        if (!isEqual(prevProps.plugin.intent, this.props.plugin.intent)) {
            this.sendAction()
        }
    }

    render() {
        const { plugin, hide } = this.props
        const url = this.generateAbsoluteUrl(plugin.plugin.url)
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

    private sendAction() {
        if (this.props.plugin.intent != null) {
            this.connection.notify('onAction', this.props.plugin.intent.action, this.props.plugin.intent.payload)
        } else {
            this.connection.notify('onAction', '', undefined)
        }
    }
}

export default PluginView