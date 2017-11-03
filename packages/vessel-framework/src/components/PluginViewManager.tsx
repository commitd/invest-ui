import * as React from 'react'

import { UiPlugin, PluginWithIntent } from 'vessel-types'
import { Handler } from 'vessel-rpc'
import PluginView from './PluginView'

export interface Props {
    plugins: UiPlugin[],
    plugin?: PluginWithIntent,
    globalHandler: Handler<{}>
    fallback?: React.ReactElement<{}>
}

interface State {
}

class PluginViewManager extends React.Component<Props, State> {

    // TODO: The idea would be to have non running plugins to be hidden, after they've first been loaded

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