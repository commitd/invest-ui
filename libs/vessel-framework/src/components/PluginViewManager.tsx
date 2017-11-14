import * as React from 'react'

import { UiPlugin, PluginWithIntent } from 'vessel-types'
import { Handler } from 'vessel-rpc'
import PluginView from './PluginView'

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
    // TODO: The idea would be to have non running plugins to be hidden, after they've first been loaded
    // This we'll need more state than just the props
}

/** Manages the display of a set of plugins, showing the fallback component if not is selected. */
class PluginViewManager extends React.Component<Props, State> {

    render() {
        const { plugin, fallback } = this.props
        return (
            <div style={{ height: '100%', width: '100%' }}>
                {plugin ?
                    <PluginView key={plugin.plugin.id} plugin={plugin} globalHandler={this.props.globalHandler} />
                    :
                    fallback}
            </div>
        )
    }
}

export default PluginViewManager as React.ComponentType<Props>