import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Container, Header, Divider } from 'semantic-ui-react'
import MessageBox from '../general/message/MessageBox'
import { PluginContext } from 'invest-plugin'
import { PluginActionDefinition } from 'invest-types'
import PluginActionGridView from '../general/ui/PluginActionGridView'

export interface OwnProps {
    fluid?: boolean
    missingTitle: string
    missingDescription: string
    check: () => boolean
    /** If set will display a set of plugins which fulfil that action. 
     * Pick the action so that its likely to provide the prereq
     * (and call this component back) eg document.search if you are document.view 
     */
    fulfillingAction?: string
}

export type State = {
    plugins: PluginActionDefinition[]
}

export type Props = OwnProps

export type Context = PluginContext

export default class PrerequisiteContainer extends React.Component<Props, State> {

    static contextTypes = {
        pluginApi: PropTypes.object
    }

    state: State = {
        plugins: []
    }

    context: Context

    componentWillMount() {
        this.updatePlugins(this.props.fulfillingAction)
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.fulfillingAction !== nextProps.fulfillingAction) {
            this.updatePlugins(nextProps.fulfillingAction)
        }
    }

    render() {
        const { check, children } = this.props
        const ok = check()

        return (
            <React.Fragment>
                {!ok && this.renderMissing()}
                {ok && children}
            </React.Fragment>
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

    private renderMissing = () => {
        const { fluid, fulfillingAction, missingTitle, missingDescription, check, children } = this.props

        return (
            <Container fluid={fluid} >
                <MessageBox title={missingTitle} description={missingDescription} />
                <Divider hidden={true} />
                {fulfillingAction && this.renderAction()}
            </Container>
        )
    }

    private renderAction = () => {
        if (this.state.plugins.length === 0) {
            return null
        }

        return (
            <div>
                <Header sub={true}>Use one of the following to find a suitable start point:</Header>
                <PluginActionGridView plugins={this.state.plugins} onSelectPlugin={this.handleSelectPlugin} />
            </div>
        )

    }

    private handleSelectPlugin = (p: PluginActionDefinition) => {
        this.context.pluginApi.navigate(p.pluginId, p.action, {})
    }
}
