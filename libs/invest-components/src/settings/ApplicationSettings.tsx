import * as React from 'react'
import { graphql, DataProps } from 'react-apollo'
import gql from 'graphql-tag'
import { PropertiesMap } from 'invest-types'

export interface OwnProps {
    defaultSettings: PropertiesMap
    children: React.ReactElement<{ settings: PropertiesMap }>
}

export type DataResponse = {
    investServer: {
        configuration: {
            settings: { [key: string]: {} }
        }
    }
}

type Props = Partial<DataProps<DataResponse, {}>> & OwnProps

type State = {
    settings: PropertiesMap
}

class ApplicationSettings extends React.Component<Props, State> {
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
                return React.cloneElement(c as React.ReactElement<{ settings: PropertiesMap }>, { settings: settings })
            } else {
                return c
            }
        })

    }

    private updateSettings = (props: Props) => {
        console.log(props)
        let settings: PropertiesMap = Object.assign({}, this.props.defaultSettings)
        if (props.data
            && props.data.investServer
            && props.data.investServer.configuration
            && props.data.investServer.configuration.settings) {
            const newSettings = props.data.investServer.configuration.settings
            Object.keys(newSettings)
                .forEach(k => {
                    settings[k] = newSettings[k]
                })
        }

        this.setState({
            settings
        })
    }
}

const QUERY = gql`
query  {
    investServer{
      configuration {
        settings 
      }
    }
  }
`

export default graphql<OwnProps, Response>(QUERY)(ApplicationSettings)
