import { ApolloClient } from 'apollo-client'
import { Connection } from 'vessel-rpc'
import { VesselRpcLink, VesselRpcLinkOptions } from './RpcLink'

export class PluginClient {
    private connection: Connection<{}>

    private client: ApolloClient<{}>

    constructor(connection: Connection<{}>) {
        this.connection = connection
    }

    createClient(): ApolloClient<{}> {
        const rpcLinkOptions: VesselRpcLinkOptions = {
            connection: this.connection
        }

        this.client = new ApolloClient({
            link: new VesselRpcLink(rpcLinkOptions)
        })

        return this.client
    }

    getClient(): ApolloClient<{}> {
        return this.client
    }
}
