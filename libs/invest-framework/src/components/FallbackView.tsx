import * as React from 'react'
import { UiPlugin } from 'invest-types'
import { PluginGridView } from 'invest-components'

export interface Props {
    /** Plugins to display */
    plugins: UiPlugin[],
    /** Callback when a plugin is selected */
    onSelectPlugin(plugin: UiPlugin): void
}

/** 
 * It could be used either a a fallback for pluginviewmanager 
 * when no plugin has been selected.
 */
export default class FallbackView extends React.Component<Props> {

    render() {
        const { plugins, onSelectPlugin } = this.props
        return (
            <PluginGridView plugins={plugins} onSelectPlugin={onSelectPlugin} />
        )
    }
}
