import * as React from 'react'
import { Loader } from 'semantic-ui-react'

import View from './View'
import { graphql, DataProps } from 'react-apollo'
import gql from 'graphql-tag'
import { Plugin } from './Types'

type DataResponse = {
    investServer: {
        uiPlugins: Plugin[]
    }
}
type Props = Partial<DataProps<DataResponse>>

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

export default graphql<{}, DataResponse>(QUERY_PLUGINS)(ViewContainer)
