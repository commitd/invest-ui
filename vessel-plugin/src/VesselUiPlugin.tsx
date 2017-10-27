import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Connection } from 'vessel-rpc'
import { createApolloRpcClient } from 'vessel-graphql'
import { ApolloProvider, ApolloClient } from 'react-apollo'
import { Handler } from 'vessel-rpc'

import { VesselPluginApi } from './VesselPluginApi'
import { PluginLifecycle } from 'vessel-common'

export interface Props {
    handler: Handler<{} & PluginLifecycle>
}

export interface Context {
    pluginApi: VesselPluginApi
}

export class VesselUiPlugin extends React.Component<Props> {
    static childContextTypes = {
        pluginApi: PropTypes.instanceOf(VesselPluginApi)
    }

    client: ApolloClient
    connection: Connection<{}>
    pluginApi: VesselPluginApi

    constructor(props: Props) {
        super(props)

        const handler = this.props.handler
        console.log('hello')
        if (!this.isInIFrame()) {
            console.log('Running standalone')
            // TODO: We need to discard the vesselUI stuff when passed to this. Messy
            this.client = new ApolloClient()
        } else {
            console.log('Running inside vessel')
            this.connection = new Connection(window, window.parent, handler)
            this.connection.start()
            this.client = createApolloRpcClient({
                connection: this.connection
            })
        }

        this.pluginApi = new VesselPluginApi(this.client, this.connection)
    }

    getChildContext(): Context {
        return {
            pluginApi: this.pluginApi
        }
    }

    render() {
        return (
            <ApolloProvider client={this.client} >
                {this.props.children}
            </ApolloProvider>
        )
    }

    private isInIFrame() {
        try {
            return window.self !== window.top
        } catch (e) {
            return true
        }
    }
}
