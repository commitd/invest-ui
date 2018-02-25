import * as React from 'react'
import { Container } from 'semantic-ui-react'
import MessageBox from '../general/message/MessageBox'
import { PluginContext } from 'invest-plugin'
import { PluginActionDefinition } from 'invest-types'
import PluginActionGridView from '../general/ui/PluginActionGridView'

export interface OwnProps {
    fluid?: boolean
    title: string
    description: string
    check: () => boolean
    /** If set will display a set of plugins which fulfil that action. 
     * Pick the action so that its likely to provide the prereq
     * (and call this component back) eg document.search if you are document.view 
     */
    action?: string
}

export type State = {
    plugins: PluginActionDefinition[]
}

export type Props = OwnProps

export type Context = PluginContext

export default class PrerequisiteContainer extends React.Component<Props, State> {

    state: State = {
        plugins: []
    }

    context: Context

    componentWillMount() {
        this.updatePlugins(this.props.action)
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.action !== nextProps.action) {
            this.updatePlugins(nextProps.action)
        }
    }

    render() {
        const { fluid, action, title, description, check, children } = this.props
        const ok = check()

        return (
            <Container fluid={fluid} >
                {!ok && <MessageBox title={title} description={description} />}
                {action && this.renderAction()}
                {ok && children}
            </Container>
        )
    }

    private updatePlugins = (action?: string) => {
        if (!action) {
            this.setState({
                plugins: []
            })
            return
        }

        this.context.pluginApi
            .findPlugins(action)
            .then((pads: PluginActionDefinition[]) => this.setState(state => ({
                plugins: pads
            })))
    }

    private renderAction = () => {
        if (this.state.plugins.length === 0) {
            return null
        }

        return (
            <div>
                <p>Use one of the following to find a suitable item</p>
                <PluginActionGridView plugins={this.state.plugins} onSelectPlugin={this.handleSelectPlugin} />
            </div>
        )

    }

    private handleSelectPlugin = (p: PluginActionDefinition) => {
        this.context.pluginApi.navigate(p.pluginId, this.props.action, {})
    }
}
