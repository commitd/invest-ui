import { Connection } from 'vessel-rpc'
import {
    ApolloClient, WatchQueryOptions, ApolloQueryResult,
    ApolloExecutionResult, MutationOptions
} from 'react-apollo'

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
            return this.connection.request('fetch', request, init)
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
    query(options: WatchQueryOptions): Promise<ApolloQueryResult<{}>> {
        return this.client.query(options)
    }

    /** 
     * Perform a graphql mutation.
     * 
     * If you have react you will probably perfer to use the react-apollo mechanisms to this direct call.
     * 
     * @param options as per Apollo
     */
    mutate(options: MutationOptions<{}>): Promise<ApolloExecutionResult<{}>> {
        return this.client.mutate(options)
    }
}
