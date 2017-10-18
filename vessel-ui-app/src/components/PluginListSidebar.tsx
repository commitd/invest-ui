import * as React from 'react'
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List'
import Icon from 'material-ui/Icon'

import { UiPlugin } from 'vessel-types'

export interface Props { 
    plugins: UiPlugin[]
    selectedPlugin?: UiPlugin,
    onPluginSelected(plugin: UiPlugin): void 
}

// TODO: Highlight the selected plugin
// TODO: How can the icons best work?

class PluginListSidebar extends React.Component<Props, {}> {
    render() {
        const { plugins, onPluginSelected } = this.props
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