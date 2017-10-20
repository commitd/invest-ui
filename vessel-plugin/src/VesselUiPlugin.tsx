import * as React from 'react'
import { Connection } from 'vessel-rpc'
import { createApolloRpcClient } from 'vessel-graphql'
import { ApolloProvider, ApolloClient } from 'react-apollo'
import { Handler } from 'vessel-rpc'

import { PluginLifecycle } from 'vessel-common'

export interface Props {
    handler: Handler<{} & PluginLifecycle>
}

export class VesselUiPlugin extends React.Component<Props> {
    client: ApolloClient
    connection: Connection<{}>

    constructor(props: Props) {
        super(props)

        const handler = this.props.handler

        if (!this.isInIFrame) {
            console.log('Running standalone')
            this.client = new ApolloClient()
        } else {
            console.log('Running inside vessel')
            this.connection = new Connection(window, window.parent, handler)
            this.connection.start()
            this.client = createApolloRpcClient({
                connection: this.connection
            })
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
