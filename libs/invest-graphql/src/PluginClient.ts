import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloCache } from 'apollo-cache'

import { Connection } from 'invest-rpc'
import { InvestRpcLink, InvestRpcLinkOptions } from './RpcLink'

export class PluginClient {
    private connection: Connection<{}>

    private client: ApolloClient<{}>

    constructor(connection: Connection<{}>) {
        this.connection = connection
    }

    createClient(): ApolloClient<{}> {
        const rpcLinkOptions: InvestRpcLinkOptions = {
            connection: this.connection
        }

        this.client = new ApolloClient({
            link: new InvestRpcLink(rpcLinkOptions),
            cache: new InMemoryCache() as ApolloCache<NormalizedCacheObject>
        })

        return this.client
    }

    getClient(): ApolloClient<{}> {
        return this.client
    }
}
