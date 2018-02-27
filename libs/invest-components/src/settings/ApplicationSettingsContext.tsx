import * as React from 'react'
import { graphql, QueryProps } from 'react-apollo'
import gql from 'graphql-tag'
import * as PropTypes from 'prop-types'
import { PropertiesMap } from 'invest-types'

export interface OwnProps {
}

export type Response = {
    investServer: {
        configuration: {
            settings?: PropertiesMap
        }
    }
}

interface GqlProps {
    data?: QueryProps & Partial<Response>
}

type Props = OwnProps & GqlProps

export type SettingContext = {
    applicationSettings: PropertiesMap
}

class ApplicationSettingsContainer extends React.Component<Props> {

    static childContextTypes = {
        applicationSettings: PropTypes.arrayOf(PropTypes.object)
    }

    getChildContext(): SettingContext {
        if (!this.props.data || !this.props.data.investServer) {
            return {
                applicationSettings: {}
            }
        }

        const investServer = this.props.data.investServer

        return {
            applicationSettings: investServer.configuration.settings ? investServer.configuration.settings : {}
        }
    }

    render() {
        return this.props.children
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

export default graphql<Response, OwnProps, Props>(QUERY)(ApplicationSettingsContainer)
