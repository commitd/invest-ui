import { Connection } from 'vessel-rpc'
import {
    ApolloClient, WatchQueryOptions, ApolloQueryResult,
    ApolloExecutionResult, MutationOptions
} from 'react-apollo'

export class VesselPluginApi {

    connection?: Connection<{}>
    client: ApolloClient

    constructor(client: ApolloClient, connection?: Connection<{}>, ) {
        this.client = client
        this.connection = connection
    }

    fetch(request: RequestInfo, init?: RequestInit): Promise<Response> {
        if (this.connection) {
            return this.connection.request('fetch', request, init)
        } else {
            return fetch(request, init)
        }
    }

    query(options: WatchQueryOptions): Promise<ApolloQueryResult<{}>> {
        return this.client.query(options)
    }

    mutate(options: MutationOptions<{}>): Promise<ApolloExecutionResult<{}>> {
        return this.client.mutate(options)
    }
}
