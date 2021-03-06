import * as React from 'react'
import { graphql, DataProps } from 'react-apollo'
import gql from 'graphql-tag'

export interface Variables {
    pluginId: string
}

export type Response = {
    investServer: {
        uiPlugin?: {
            settings?: string
        }
    }
}

type Props = Partial<DataProps<Response, Variables>>

type State<T> = {
    settings?: T
}

class PluginSettings<T> extends React.Component<Props, State<T>> {
    componentWillMount() {
        if (this.props.data != null) {
            this.updateSettings(this.props)
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.data !== nextProps.data && nextProps.data) {
            this.updateSettings(nextProps)
        }
    }

    render() {
        const { settings } = this.state

        return React.Children.map(this.props.children, c => {
            if (React.isValidElement(c)) {
                return React.cloneElement(c as React.ReactElement<{ settings: T }>, { settings: settings })
            } else {
                return c
            }
        })

    }

    private updateSettings = (props: Props) => {
        let settings = undefined
        if (props.data
            && props.data.investServer
            && props.data.investServer.uiPlugin
            && props.data.investServer.uiPlugin.settings) {
            try {
                settings = JSON.parse(props.data.investServer.uiPlugin.settings)

            } catch (error) {
                // Do nothing... will be set to undefined
            }
        }

        this.setState({
            settings
        })
    }
}

const QUERY = gql`
query GetSettings($pluginId:String!){
    investServer {
        uiPlugin(pluginId:$pluginId) {
            settings
        }
    }
}
`

export default graphql<{}, Response, Variables>(QUERY)(PluginSettings)
