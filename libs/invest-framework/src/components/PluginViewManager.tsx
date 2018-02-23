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
    fallback?: React.ReactElement<{}>
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
        this.ensureSelectedView(this.props, this.state)
    }

    componentWillReceiveProps(nextProps: Props, nextState: State) {
        if (nextProps.plugin
            && (!this.props.plugin || (this.props.plugin && nextProps.plugin.plugin.id !== this.props.plugin.plugin.id))
        ) {
            this.ensureSelectedView(nextProps, this.state)
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
                            <PluginView plugin={v.plugin} globalHandler={globalHandler} hide={!show} />
                        </div>
                    }
                    )
                }
            </div>
        )
    }

    private ensureSelectedView(props: Props, state: State) {
        if (!props.plugin) {
            return
        }

        const selectedPlugin = props.plugin

        // Look for an existing plugin view
        const views = state.views.filter(p => p.plugin.plugin.id === selectedPlugin.plugin.id)

        // Do we have a plugin view for that id already?
        if (views.length === 0) {
            // No, create one

            const view = {
                plugin: props.plugin
            }

            this.setState((s: State) => ({
                views: [view].concat(s.views)
            }))
        } else if (views.length === 1) {
            // Yes, udpate the pluginwithintent (if changed)
            const view = views[0]
            if (!isEqual(view.plugin, selectedPlugin)) {
                view.plugin = selectedPlugin

                this.setState((s: State) => ({
                    views: [view].concat(s.views.filter(p => p.plugin.plugin.id !== selectedPlugin.plugin.id))
                }))
            }
        } else {
            throw new Error('Multiple views per plugin are not supported (yet)!')
        }
    }
}

export default PluginViewManager as React.ComponentType<Props>