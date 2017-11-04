import * as React from 'react'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Icon from 'material-ui/Icon'

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
        const { plugins, onPluginSelected } = this.props

        // TODO: Highlight which plugin is currently selected

        return (
            <List dense={true}>
                {
                    plugins.map(p => (
                        <ListItem key={p.id} button={true} onClick={() => onPluginSelected(p)}>
                            <ListItemIcon>
                                <Icon >{p.icon || 'add_circle'}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={p.name} secondary={p.description} />
                        </ListItem>

                    ))}
            </List>
        )
    }
}

export default PluginListSidebar