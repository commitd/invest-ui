import * as React from 'react'
import * as PropTypes from 'prop-types'
import { PluginContext } from 'invest-plugin'
import { Dropdown } from 'semantic-ui-react'
import { Plugin } from './Types'
import ActionForm from './ActionForm'

type Props = {
    plugins: Plugin[]
}

type State = {
    plugin?: Plugin
}

type Context = PluginContext

class View extends React.Component<Props, State> {

    static contextTypes = {
        pluginApi: PropTypes.object
    }

    context: Context

    state: State = {
    }

    handleChangePlugin = (event: {}, data: { value: string }) => {
        const plugin = this.props.plugins.find(p => p.id === data.value)

        this.setState({
            plugin
        })
    }

    render() {
        const { plugins } = this.props
        const pluginOptions = plugins.map(p => (
            { key: p.id, text: p.name, value: p.id }
        ))

        const { plugin } = this.state
        return (
            <div>
                <Dropdown
                    placeholder="Select plugin to send to"
                    fluid={true}
                    selection={true}
                    options={pluginOptions}
                    onChange={this.handleChangePlugin}
                />

                {plugin &&
                    <div>
                        <hr />
                        <ActionForm plugin={plugin} />
                    </div>
                }

            </div>
        )
    }
}

export default View
