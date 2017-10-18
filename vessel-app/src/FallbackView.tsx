import * as React from 'react'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import { withStyles, WithStyles, Theme, StyleRulesCallback } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

import { UiPlugin } from 'vessel-types'

const styles: StyleRulesCallback = (theme: Theme) => ({
    root: {
        flexGrow: 1,
        padding: 2 * theme.spacing.unit
    },
    paper: {
        // height: '100%',
        // width: '100%',
        padding: 2 * theme.spacing.unit
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
})

interface Props {
    plugins: UiPlugin[],
    onSelectPlugin(plugin: UiPlugin): void
}

class FallbackView extends React.Component<Props & WithStyles> {

    render() {
        const { plugins, classes, onSelectPlugin } = this.props
        return (
            <Grid container={true} className={classes.root}>
                {
                    plugins.map((p: UiPlugin) => (
                        <Grid key={p.id} item={true} xs={6}>
                            <Paper className={classes.paper} onClick={() => onSelectPlugin && onSelectPlugin(p)} >
                                <Typography type="title">{p.name}</Typography>
                                <Typography type="subheading">{p.description}</Typography>
                            </Paper>

                        </Grid>

                    ))
                }
            </Grid>)
    }
}

export default withStyles(styles)(FallbackView)
