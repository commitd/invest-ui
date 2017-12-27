import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Context as PluginContext } from 'invest-plugin'
import { Dropdown, Button, Form, TextArea, Message } from 'semantic-ui-react'
import { Plugin } from './Types'

type Props = {
    plugin: Plugin
}

type State = {
    action: string,
    payload: string
}

type Context = PluginContext

class View extends React.Component<Props, State> {

    static contextTypes = {
        pluginApi: PropTypes.object
    }

    context: Context

    state: State = {
        action: '',
        payload: ''
    }

    handleChangeAction = (event: {}, data: { value: string }) => {
        this.setState({
            action: data.value
        })
    }

    handleChangePayload = (event: {}, data: { value: string }) => {
        this.setState({
            payload: data.value
        })
    }

    handleSend = () => {
        const { action, payload } = this.state
        this.context.pluginApi.navigate(this.props.plugin.id, action, payload === '' ? undefined : JSON.parse(payload))
    }

    render() {
        const { plugin } = this.props
        const actionOptions = plugin.actions.map(a => (
            { key: a.action, text: a.title, value: a.action }
        ))

        const { action, payload } = this.state

        const validPayload = this.checkPayload(payload)
        const error = !validPayload
        return (

            <div>
                <h3>{plugin.name}</h3>
                <p>{plugin.description}</p>

                <Form error={error}>
                    <Form.Field>
                        <label>Action (select or enter free form)</label>

                        <Dropdown
                            placeholder="Select action"
                            fluid={true}
                            selection={true}
                            options={actionOptions}
                            onChange={this.handleChangeAction}
                            value={action}
                        />
                        <Form.Input value={action} onChange={this.handleChangeAction} />
                    </Form.Field>

                    <Form.Field error={!validPayload}>
                        <label>Payload</label>
                        <TextArea value={payload} onChange={this.handleChangePayload} />
                        <Message
                            error={true}
                            header="Not valid JSON"
                            content="The payload needs to be blank, or valid JSON"
                        />
                    </Form.Field>
                    <Button onClick={this.handleSend} disabled={action === ''}>Send</Button>
                </Form>
            </div>
        )
    }

    private checkPayload = (payload: string) => {
        if (payload === undefined || payload === '') {
            return true
        }

        try {
            JSON.parse(payload)
            return true
        } catch {
            return false
        }
    }
}

export default View
