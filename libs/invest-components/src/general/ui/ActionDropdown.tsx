import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Dropdown, Button } from 'semantic-ui-react'
import { Context as PluginContext } from 'invest-plugin'
import { PluginActionDefinition } from 'invest-types'

export interface OwnProps {
    // Provide one of action or actions
    action?: string,
    actions?: string[]
    text: string
    onSelect(act: (payload?: {}) => void, action: string, pad: PluginActionDefinition): void
}

export type Context = PluginContext

export interface State {
    actions?: PluginActionDefinition[]
}

export type Props = OwnProps

class ActionDropdown extends React.Component<Props, State> {

    static contextTypes = {
        pluginApi: PropTypes.object
    }

    state: State = {
        actions: []
    }

    context: Context

    componentDidMount() {

        const actions = this.props.actions != null ? this.props.actions :
            this.props.action != null ? [this.props.action] : []

        actions.forEach(action => {
            this.context.pluginApi
                .findPlugins(action)
                .then((pads: PluginActionDefinition[]) => this.setState(state => ({
                    actions: (state.actions == null ? pads : [...state.actions].concat(pads))
                })))
        })
    }

    handleSelect = (pad: PluginActionDefinition) => () => {
        this.props.onSelect(
            (payload?: {}) => {
                this.context.pluginApi.navigate(pad.pluginId, pad.action, payload)
            },
            pad.action,
            pad)
    }

    render() {
        const { text } = this.props
        const { actions } = this.state

        if (actions == null || actions.length === 0) {
            // We could returned a disable button
            // return <Button disabled={true}>{text}</Button>
            // but I think it's nicer to just remove it totally
            return <span />
        }

        return (
            <Button.Group>
                <Button onClick={this.handleSelect(actions[0])}> {text}</Button>
                <Dropdown floating={true} button={true} className="icon">
                    <Dropdown.Menu>
                        {
                            actions.map(p => <Dropdown.Item
                                onClick={this.handleSelect(p)}
                                key={`${p.pluginId}_${p.title}`}
                                text={p.title}
                            />)}
                    </Dropdown.Menu>
                </Dropdown>}
            </Button.Group>
        )
    }
}

export default ActionDropdown