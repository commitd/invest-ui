import * as React from 'react'

import { UiPlugin, PluginWithIntent } from 'invest-types'
import { Handler } from 'invest-rpc'
import PluginView from './PluginView'
const isEqual = require('lodash.isequal')

export interface Props {
    /** All plugins available */
    plugins: UiPlugin[],
    /** The plugin (and its acive intent) to display. Changes to intent will be pushed to the active plugin. */
    plugin?: PluginWithIntent,
    /** Handler to pass all menssages pup to */
    globalHandler: Handler<{}>
    /** component to render if no plugin is selected */
    fallback?: React.ReactElement<{}>,
    /** Root URL of server */
    serverUrl: string
}

interface State {
    views: {
        plugin: PluginWithIntent
    }[]
}

/** Manages the display of a set of plugins, showing the fallback component if not is selected. */
class PluginViewManager extends React.Component<Props, State> {

    state: State = {
        views: []
    }

    componentWillMount() {
        this.ensureSelectedView(this.props)
    }

    componentWillReceiveProps(nextProps: Props, nextState: State) {
        if (nextProps.plugin
            && (!this.props.plugin || (this.props.plugin && !isEqual(nextProps.plugin, this.props.plugin))
        )) {
            this.ensureSelectedView(nextProps)
        }
    }

    render() {
        const { plugin, fallback, globalHandler } = this.props
        const { views } = this.state
        return (
            <div style={{ height: '100%', width: '100%' }}>
                {!plugin && fallback}
                {
                    views.map(v => {
                        const show = plugin && v.plugin.plugin.id === plugin.plugin.id
                        const display = show ? 'block' : 'none'
                        return <div
                            key={v.plugin.plugin.id}
                            style={{ display: display, height: '100%', width: '100%' }}
                        >
                            <PluginView
                                serverUrl={this.props.serverUrl}
                                plugin={v.plugin}
                                globalHandler={globalHandler}
                                hide={!show}
                            />
                        </div>
                    }
                    )
                }
            </div>
        )
    }

    private ensureSelectedView(props: Props) {
        if (!props.plugin) {
            return
        }

        const selectedPlugin = props.plugin

        this.setState((state: State) => {

            // Look for an existing plugin view
            const views = state.views.filter(p => p.plugin.plugin.id === selectedPlugin.plugin.id)

            // Do we have a plugin view for that id already?
            if (views.length === 0) {
                // No, create one

                const view = {
                    plugin: selectedPlugin
                }

                return {
                    views: [view].concat(state.views)
                }
            } else if (views.length === 1) {
                // Yes, udpate the pluginwithintent (if changed)
                const view = views[0]
                if (!isEqual(view.plugin, selectedPlugin)) {
                    view.plugin = selectedPlugin

                    const otherViews = state.views.filter(p => p.plugin.plugin.id !== selectedPlugin.plugin.id)

                    return {
                        views: [view].concat(otherViews)
                    }
                }
            } else {
                throw new Error('Multiple views per plugin are not supported (yet)!')
            }
            return state
        })

    }
}

export default PluginViewManager as React.ComponentType<Props>