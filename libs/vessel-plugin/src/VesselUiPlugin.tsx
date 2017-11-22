import * as React from 'react'
import * as PropTypes from 'prop-types'
import { ApolloProvider } from 'react-apollo'
import { Handler } from 'vessel-rpc'

import { VesselPluginApi } from './VesselPluginApi'
import { PluginLifecycle } from 'vessel-common'

import { createVesselPluginApi } from './Connect'

/** Our child can receive action and payload via props */
export type ChildProps = {
    /** The action (if any) */
    action?: string,
    /** the payload (if any) */
    payload?: {}
}

/** Props  */
export interface Props {
    /** Handler to pass any plugin lifecycle notification too.  */
    handler?: Handler<PluginLifecycle>
    /** A single child. THis will have the action and payload push to as props (when they change). */
    children: React.ReactElement<{} & ChildProps>,
    /** Full screen, no padding, etc */
    fullscreen?: boolean
}

/** The Context will will provide  */
export interface Context {
    pluginApi: VesselPluginApi
}

interface State {
    action?: string,
    payload?: {}
}

/**
 * A helper implementation to support plugin development set.
 * 
 * This is designed to be used at the top level wrapper in React:
 * 
 * ```
 * ReactDOM.render(
 * <VesselUiPlugin handler={handler}>
 *   <App />
 * </VesselUiPlugin>,
 * document.getElementById('root') as HTMLElement
 * ```
 * 
 * It will set up Apollo, the RPC connection and provide the VesselPluginAPI via context.
 * 
 * You can provide a handler via props which will receive PLuginLifecycle notifications.
 * 
 * Any recieved actions and payloads will be placed on this components React.Child via 
 * the props mechanism. As such you can listen to shouldWillRecieveProps in order to 
 * response to changes. 
 * 
 */
class VesselUiPlugin extends React.Component<Props, State> {
    static childContextTypes = {
        pluginApi: PropTypes.instanceOf(VesselPluginApi)
    }

    pluginApi: VesselPluginApi

    state = {
        action: undefined,
        payload: undefined
    }

    constructor(props: Props) {
        super(props)

        const handler = this.wrapHandler(this.props.handler || {})
        this.pluginApi = createVesselPluginApi(handler)
    }

    getChildContext(): Context {
        return {
            pluginApi: this.pluginApi
        }
    }

    render() {
        const { fullscreen } = this.props

        // For simplicity we assume a single child
        const child = React.Children.only(this.props.children)

        let style: {} | undefined = undefined
        if (fullscreen) {
            style = {
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100vh'
            }
        } else {
            style = {
                padding: '15px'
            }
        }

        return (
            <ApolloProvider client={this.pluginApi.client} >
                <div style={style}>
                    {React.cloneElement(child, { action: this.state.action, payload: this.state.payload })}
                </div>
            </ApolloProvider >
        )
    }

    private wrapHandler = (handler: Handler<PluginLifecycle>): Handler<PluginLifecycle> => {
        return {
            ...handler,
            onAction: (action: string, payload?: string) => {
                // This is the correct way though perhaps over engineered for real world
                const p = new Promise((resolve, reject) => {
                    this.setState(
                        {
                            action,
                            payload: payload && JSON.parse(payload)
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

// Typescript dance to loose the State
const Component = VesselUiPlugin as React.ComponentType<Props>
export {
    Component as VesselUiPlugin
}