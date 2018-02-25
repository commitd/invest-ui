import * as React from 'react'
import { UiPlugin } from 'invest-types'
import { Card, Grid, Icon } from 'semantic-ui-react'

export interface Props {
    /** Plugins to display */
    plugins: UiPlugin[],
    /** Callback when a plugin is selected */
    onSelectPlugin(plugin: UiPlugin): void
}

export default class PluginGridView extends React.Component<Props> {

    render() {
        const { plugins, onSelectPlugin } = this.props
        return (
            <Grid columns={4} padded={true}>
                {
                    plugins.map((p: UiPlugin) => (
                        <Grid.Column key={p.id}>
                            <Card onClick={() => onSelectPlugin && onSelectPlugin(p)}>
                                <Icon name={p.icon} size="massive" />
                                <Card.Content>
                                    <Card.Header>{p.name}</Card.Header>
                                    <Card.Description>{p.description}</Card.Description>
                                </Card.Content>
                            </Card>

                        </Grid.Column>

                    ))
                }
            </Grid>)
    }
}