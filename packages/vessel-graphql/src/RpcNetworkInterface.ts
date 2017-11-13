import {
    Request,
    NetworkInterface,
    ApolloClient
} from 'apollo-client'
import { ExecutionResult } from 'graphql'
import { Connection } from 'vessel-rpc'

export interface Options {
    connection: Connection<{}>,
    method?: string
}

export class VesselRpcNetworkInterface implements NetworkInterface {
    private connection: Connection<{}>
    private method: string

    constructor(options: Options) {
        this.connection = options.connection
        this.method = options.method || 'graphql'
    }

    query(request: Request): Promise<ExecutionResult> {
        return this.connection.request<ExecutionResult>(this.method, request)
    }

    // TODO add use / useAfter?
}

export function createVesselRpcNetworkInterface(options: Options): VesselRpcNetworkInterface {
    return new VesselRpcNetworkInterface(options)
}

export function createApolloRpcClient(options: Options): ApolloClient {
    return new ApolloClient({
        networkInterface: createVesselRpcNetworkInterface(options)
    })
}
