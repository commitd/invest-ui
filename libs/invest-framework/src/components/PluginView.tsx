import * as React from 'react'

import { Handler, Connection } from 'invest-rpc'
import { PluginWithIntent } from 'invest-types'
import IFrame from './IFrame'
const isEqual = require('lodash.isequal')

export interface Props {
    /** The plugin (with intent) to display */
    plugin: PluginWithIntent
    /** Handler to pass messages up to */
    globalHandler: Handler<{}>
    /** Signal that the plugin is hidden (this component will not hide it for you!) */
    hide?: boolean
}

// window.location.hostname? That doesn;t work in dev mode with webpack .
//  It might have to come from the server / config? And if null then fallback
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

        this.handler = this.props.globalHandler
    }

    handleLoad = (connection: Connection<{}>) => {
        this.connection = connection
        this.connection.notify('onLoad')
        this.connection.notify('onShow')
        this.sendAction(this.props)

    }

    componentWillUnmount() {
        if (this.connection) {
            this.connection.notify('onHide')
            this.connection.notify('onUnload')
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.hide !== this.props.hide && this.connection) {
            if (nextProps.hide) {
                this.connection.notify('onHide')
            } else {
                this.connection.notify('onShow')
            }
        }

        // If the action has changed, then we need to tell the plugin
        if (!isEqual(nextProps.plugin.intent, this.props.plugin.intent)) {
            this.sendAction(nextProps)
        }
    }

    shouldComponentUpdate() {
        // Once rendered never call render again, all other updates are handled trhough
        // the message interface
        // Technically you could change src, but thats not supported!
        return false
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

    private sendAction(props: Props) {
        if (props.plugin.intent != null) {
            this.connection.notify('onAction', props.plugin.intent.action, props.plugin.intent.payload)
        }
    }
}

export default PluginView