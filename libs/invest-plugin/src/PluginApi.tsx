import {
    ApolloClient, WatchQueryOptions, ApolloQueryResult, MutationOptions
} from 'apollo-client'
import { FetchResult } from 'apollo-link'

import { Connection } from 'invest-rpc'
import { PluginActionDefinition } from 'invest-types'
import { hydrateSimpleResponse } from 'invest-utils'
import gql from 'graphql-tag'

const LOCAL_NAVIGATE_MUTATION = gql`
mutation navigate($pluginId: String!, $action: String, $payload: String) {
    navigateToPlugin(input: {pluginId: $pluginId, action: $action, payload: $payload}) {
    success
  }
}
`

const REMOTE_NAVIGATE_MUTATION = gql`
mutation navigate($pluginId: String!, $action: String, $payload: String) {
    navigateToPlugin: remoteNavigateToPlugin(input: {pluginId: $pluginId, action: $action, payload: $payload}) {
    success
  }
}
`

interface FindPluginResponse {
    investUi: {
        actions: {
            definitions: PluginActionDefinition[]
        }
    }
}

const LOCAL_FIND_PLUGINS_QUERY = gql`
query findPlugins($action: String!){
    investUi {
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

const REMOTE_FIND_PLUGINS_QUERY = gql`
query findPlugins($action: String!){
    investUi: remoteInvestUi {
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
export class PluginApi {

    connection?: Connection<{}>
    client: ApolloClient<{}>
    localMode: boolean

    /**
     * Create a new API client.
     * 
     * @param client apollo client
     * @param connection connection 
     */
    constructor(localMode: boolean, client: ApolloClient<{}>, connection?: Connection<{}>) {
        this.client = client
        this.connection = connection
        this.localMode = localMode
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
                variables: variables,
                fetchPolicy: 'network-only'
            })
        } else {
            const query = Object.assign({ fetchPolicy: 'network-only' }, options)
            return this.client.query(query)
        }
    }

    /** 
     * Perform a graphql mutation.
     * 
     * If you have react you will probably perfer to use the react-apollo mechanisms to this direct call.
     * 
     * @param options as per Apollo
     */
    mutate(options: MutationOptions<{}> | string, variables?: {}): Promise<FetchResult<{}>> {
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
            mutation: this.localMode ? LOCAL_NAVIGATE_MUTATION : REMOTE_NAVIGATE_MUTATION,
            variables: {
                pluginId,
                action,
                payload: payload && JSON.stringify(payload)
            }
        }).then((r: ApolloQueryResult<{ success: boolean }>) => {
            return r != null && r.data && r.data.success ? r.data : { success: false }
        })
    }

    findPlugins(action: string): Promise<PluginActionDefinition[]> {
        return this.query({
            query: this.localMode ? LOCAL_FIND_PLUGINS_QUERY : REMOTE_FIND_PLUGINS_QUERY,
            variables: {
                action
            },
            fetchPolicy: 'cache-first'
        }).then((r: ApolloQueryResult<FindPluginResponse>) => {
            console.log(r)
            return r != null
                && r.data != null
                && r.data.investUi != null
                && r.data.investUi.actions != null
                && r.data.investUi.actions.definitions != null
                ? r.data.investUi.actions.definitions
                : []
        })
    }
}
