import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Connection } from 'vessel-rpc'
import { createApolloRpcClient } from 'vessel-graphql'
import { ApolloProvider, ApolloClient } from 'react-apollo'
import { Handler } from 'vessel-rpc'

import { VesselPluginApi } from './VesselPluginApi'
import { PluginLifecycle } from 'vessel-common'

export type ChildProps = {
    action?: string,
    payload?: {}
}

export interface Props {
    handler: Handler<PluginLifecycle>
    children: React.ReactElement<{} & ChildProps>
}

export interface Context {
    pluginApi: VesselPluginApi
}

interface State {
    action?: string,
    payload?: {}
}

class VesselUiPlugin extends React.Component<Props, State> {
    static childContextTypes = {
        pluginApi: PropTypes.instanceOf(VesselPluginApi)
    }

    client: ApolloClient
    connection: Connection<{}>
    pluginApi: VesselPluginApi

    state = {
        action: undefined,
        payload: undefined
    }

    constructor(props: Props) {
        super(props)

        const handler = this.wrapHandler(this.props.handler)
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
        // For simplicity we assume a single child
        const child = React.Children.only(this.props.children)

        return (
            <ApolloProvider client={this.client} >
                {React.cloneElement(child, { action: this.state.action, payload: this.state.payload })}
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

    private wrapHandler = (handler: Handler<PluginLifecycle>): Handler<PluginLifecycle> => {
        return {
            ...handler,
            onAction: (action: string, payload?: {}) => {
                // This is the correct way though perhaps over engineered for real world
                const p = new Promise((resolve, reject) => {
                    this.setState(
                        {
                            action,
                            payload
                        },
                        () => resolve()
                    )
                })
                if (!handler.onAction) {
                    return p
                } else {
                    return Promise.all([p, handler.onAction(action, payload)])
                }
            },
        }
    }
}

const Component = VesselUiPlugin as React.ComponentType<Props>
export {
    Component as VesselUiPlugin
}