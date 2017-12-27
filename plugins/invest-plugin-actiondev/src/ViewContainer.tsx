import * as React from 'react'
import { Loader } from 'semantic-ui-react'

import View from './View'
import { graphql, gql, QueryProps } from 'react-apollo'
import { Plugin } from './Types'

type Response = {
    investServer: {
        uiPlugins: Plugin[]
    }
}

type OwnProps = {

}

type GqlProps = {
    data?: QueryProps & Partial<Response>
}

type Props = OwnProps & GqlProps

class ViewContainer extends React.Component<Props> {

    render() {
        const { data } = this.props

        if (!data || data.loading || !data.investServer || !data.investServer.uiPlugins) {
            return <Loader active={true} />
        }

        return (
            <View plugins={data.investServer.uiPlugins} />
        )
    }
}

const QUERY_PLUGINS = gql`
query GET_PLUGINS {
    investServer {
        uiPlugins {
            id
            name
            description
            actions {  
                action
                title
                description
            }
        }
    }
}

`

export default graphql<Response, OwnProps, Props>(QUERY_PLUGINS)(ViewContainer)
