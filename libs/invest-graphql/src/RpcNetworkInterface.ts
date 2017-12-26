import {
    Request,
    NetworkInterface,
    ApolloClient
} from 'apollo-client'
import { ExecutionResult } from 'graphql'
import { Connection } from 'invest-rpc'

import { loggerFactory } from 'invest-utils'
const logger = loggerFactory.getLogger('InvestRpcNetworkInterface')

export interface Options {
    connection: Connection<{}>,
    method?: string
}

export class InvestRpcNetworkInterface implements NetworkInterface {
    private connection: Connection<{}>
    private method: string

    constructor(options: Options) {
        this.connection = options.connection
        this.method = options.method || 'graphql'
    }

    query(request: Request): Promise<ExecutionResult> {
        logger.trace('InvestRpcNetworkInterface.query', request)
        return this.connection.request<ExecutionResult>(this.method, request)
    }

    // TODO add use / useAfter?
}

export function createInvestRpcNetworkInterface(options: Options): InvestRpcNetworkInterface {
    return new InvestRpcNetworkInterface(options)
}

export function createApolloRpcClient(options: Options): ApolloClient {
    return new ApolloClient({
        networkInterface: createInvestRpcNetworkInterface(options)
    })
}
