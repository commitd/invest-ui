import * as React from 'react'
import { Icon, Menu, Header } from 'semantic-ui-react'

import { UiPlugin } from 'vessel-types'

export interface Props {
    /** PLugins to dispay on the menu */
    plugins: UiPlugin[]
    /** the currently selected / displayed plugin */
    selectedPlugin?: UiPlugin,
    /**  */
    onPluginSelected(plugin: UiPlugin): void
}

/** Displays a list of plugins a sidebar menu */
class PluginListSidebar extends React.Component<Props, {}> {
    render() {
        const { plugins, selectedPlugin, onPluginSelected } = this.props

        // TODO: Highlight which plugin is currently selected

        return (
            <Menu vertical={true} fluid={true} inverted={true} style={{ borderRadius: 0 }} >
                {
                    plugins.map(p => (
                        <Menu.Item
                            key={p.id}
                            active={selectedPlugin && selectedPlugin.id === p.id}
                            onClick={() => onPluginSelected(p)}
                        >
                            <Header inverted={true} as="h5">
                                <Icon name={p.icon || 'chevron circle right'} />&nbsp;{p.name}
                            </Header>
                            <small>{p.description}</small>
                        </Menu.Item>

                    ))
                }
            </ Menu>
        )
    }
}

export default PluginListSidebar