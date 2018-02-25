import * as React from 'react'
import { graphql, QueryProps } from 'react-apollo'
import gql from 'graphql-tag'
import { Setting, SettingsMap } from 'invest-types'

export interface OwnProps {
    defaultSettings: SettingsMap
    children: React.ReactElement<{ settings: SettingsMap }>
}

export type Response = {
    investServer: {
        configuration: {
            settings?: Setting[]
        }
    }
}

interface GqlProps {
    data?: QueryProps & Partial<Response>
}

type Props = OwnProps & GqlProps

type State = {
    settings: SettingsMap
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
                return React.cloneElement(c as React.ReactElement<{ settings: SettingsMap }>, { settings: settings })
            } else {
                return c
            }
        })

    }

    private updateSettings = (props: Props) => {
        let settings: SettingsMap = Object.assign({}, this.props.defaultSettings)
        if (props.data
            && props.data.investServer
            && props.data.investServer.configuration
            && props.data.investServer.configuration.settings) {
            props.data.investServer.configuration.settings
                .forEach(s => {
                    settings[s.key] = s.value
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
        settings {
          key
          value
        }
      }
    }
  }
`

export default graphql<Response, OwnProps, Props>(QUERY)(ApplicationSettings)
