import {
    ApolloClient, WatchQueryOptions, ApolloQueryResult,
    ApolloExecutionResult, MutationOptions, gql
} from 'react-apollo'

import { Connection } from 'vessel-rpc'
import { PluginActionDefinition } from 'vessel-types'
import { hydrateSimpleResponse } from 'vessel-utils'

const NAVIGATE_MUTATION = gql`
mutation navigate($pluginId: String!, $action: String, $payload: String) {
  vesselUi {
    navigate(input: {pluginId: $pluginId, action: $action, payload: $payload}) {
      success
    }
  }
}
`

interface FindPluginResponse {
    vesselUi: {
        actions: {
            definitions: PluginActionDefinition[]
        }
    }
}

const FIND_PLUGINS_QUERY = gql`
query findPlugins($action: String!){
  vesselUi {
    actions(input: { action: $action }) {
      definitions {
        pluginId
        action
        title
        description
      }
    }
  }
}
`

/**
 * A client implemenation which will calle the API which the outer application (via the RPC layer).
 * 
 */
export class VesselPluginApi {

    connection?: Connection<{}>
    client: ApolloClient

    /**
     * Create a new API client.
     * 
     * @param client apollo client
     * @param connection connection 
     */
    constructor(client: ApolloClient, connection?: Connection<{}>, ) {
        this.client = client
        this.connection = connection
    }

    /**
     * Perform a fetch (ie HTTP call) to the server
     * 
     * PLugin implementers must use this, rather than calling fetch yourself or any other 
     * $.ajax method since a plugin does not have any authenitcaiotn information and is likley
     * not in the same origin as the server. Thus requests will be blocked.
     * 
     * @param request the request (as per standard fetch api)
     * @param init (as per standard fetch api)
     */
    fetch(request: RequestInfo, init?: RequestInit): Promise<Response> {
        if (this.connection) {
            return this.connection.request('fetch', request, init).then(hydrateSimpleResponse)
        } else {
            return fetch(request, init)
        }
    }

    /** 
     * Perform a graphql query.
     * 
     * If you have react you will probably perfer to use the react-apollo mechanisms to this direct call.
     * 
     * @param options as per Apollo
     */
    query(options: WatchQueryOptions | string, variables?: {}): Promise<ApolloQueryResult<{}>> {
        if (typeof options === 'string') {
            return this.client.query({
                query: gql(options),
                variables: variables
            })
        } else {
            return this.client.query(options)
        }
    }

    /** 
     * Perform a graphql mutation.
     * 
     * If you have react you will probably perfer to use the react-apollo mechanisms to this direct call.
     * 
     * @param options as per Apollo
     */
    mutate(options: MutationOptions<{}> | string, variables?: {}): Promise<ApolloExecutionResult<{}>> {
        if (typeof options === 'string') {
            return this.client.mutate({
                mutation: gql(options),
                variables: variables
            })
        } else {
            return this.client.mutate(options)
        }
    }

    /** Short hand to support navigation requests */
    navigate(pluginId: string, action?: string, payload?: {}): Promise<{ success: boolean }> {
        return this.mutate({
            mutation: NAVIGATE_MUTATION,
            variables: {
                pluginId,
                action,
                payload: payload && JSON.stringify(payload)
            }
        }).then((r: ApolloQueryResult<{ success: boolean }>) => {
            return r.data
        })
    }

    findPlugins(action: string): Promise<PluginActionDefinition[]> {
        return this.query({
            query: FIND_PLUGINS_QUERY,
            variables: {
                action
            }
        }).then((r: ApolloQueryResult<FindPluginResponse>) => {
            return r.data.vesselUi.actions.definitions
        })
    }
}
