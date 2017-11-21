import * as React from 'react'
import { UiPlugin } from 'vessel-types'
import { Card, Grid, Icon } from 'semantic-ui-react'

export interface Props {
    /** Plugins to display */
    plugins: UiPlugin[],
    /** Callback when a plugin is selected */
    onSelectPlugin(plugin: UiPlugin): void
}

/** 
 * A component whish displays a list of plugins. 
 * It could be used either a a fallback for pluginviewmanager 
 * when no plugin has been selected.
 */
class FallbackView extends React.Component<Props> {

    render() {
        const { plugins, onSelectPlugin } = this.props
        return (
            <Grid columns={4}>
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

export default FallbackView
