import * as React from 'react'
import { Icon, Menu, Header, Input, InputOnChangeData, Button } from 'semantic-ui-react'

import { UiPlugin } from 'invest-types'

export interface Props {
    /** PLugins to dispay on the menu */
    plugins: UiPlugin[]
    /** the currently selected / displayed plugin */
    selectedPlugin?: UiPlugin,
    /**  */
    onPluginSelected(plugin: UiPlugin): void
}

export type State = {
    query: string
}

/** Displays a list of plugins a sidebar menu */
class PluginListSidebar extends React.Component<Props, State> {

    state: State = {
        query: ''
    }

    render() {
        const { plugins, selectedPlugin, onPluginSelected } = this.props
        const { query } = this.state

        const normalizedQuery = query.trim().toLowerCase()
        const hasQuery = normalizedQuery !== ''
        const filteredPlugins = !hasQuery ? plugins : plugins.filter(p =>
            p.name.toLowerCase().includes(normalizedQuery) || p.description.toLowerCase().includes(normalizedQuery)
        )

        const searchAction = !hasQuery ? undefined
            : <Button icon="remove" onClick={this.handleClearSearch} />

        return (
            <Menu vertical={true} fluid={true} inverted={true} style={{ borderRadius: 0 }} >
                <Menu.Item>
                    <Input
                        fluid={true}
                        inverted={true}
                        placeholder="Filter..."
                        onChange={this.handleSearchChange}
                        action={searchAction}
                        value={query}
                    />
                </Menu.Item>
                {
                    filteredPlugins.map(p => (
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

    private handleSearchChange = (event: {}, data: InputOnChangeData) => {
        this.setState({
            query: data.value
        })
    }

    private handleClearSearch = () => {
        this.setState({
            query: ''
        })
    }
}

export default PluginListSidebar