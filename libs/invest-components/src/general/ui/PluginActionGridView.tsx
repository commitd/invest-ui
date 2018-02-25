import * as React from 'react'
import { PluginActionDefinition } from 'invest-types'
import { Card, Grid } from 'semantic-ui-react'

export interface Props {
    /** Plugins to display */
    plugins: PluginActionDefinition[],
    /** Callback when a plugin is selected */
    onSelectPlugin(plugin: PluginActionDefinition): void
}

export default class PluginGridView extends React.Component<Props> {

    render() {
        const { plugins, onSelectPlugin } = this.props
        return (
            <Grid columns={4} padded={true}>
                {
                    plugins.map((p: PluginActionDefinition) => (
                        <Grid.Column key={`${p.pluginId}-${p.action}`}>
                            <Card onClick={() => onSelectPlugin && onSelectPlugin(p)}>
                                <Card.Content>
                                    <Card.Header>{p.title}</Card.Header>
                                    <Card.Description>{p.description}</Card.Description>
                                </Card.Content>
                            </Card>

                        </Grid.Column>

                    ))
                }
            </Grid>)
    }
}