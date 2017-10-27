import { Connection } from 'vessel-rpc'
import { ApolloClient, WatchQueryOptions, NetworkStatus } from 'react-apollo'

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

    graphql(options: WatchQueryOptions): Promise<{
        data: {},
        loading: boolean,
        stale: boolean,
        networkStatus: NetworkStatus
    }> {
        return this.client.query(options)
    }
}
