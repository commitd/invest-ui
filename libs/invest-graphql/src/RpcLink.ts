import { ApolloLink, Operation, NextLink, FetchResult, GraphQLRequest } from 'apollo-link'
import * as Observable from 'zen-observable'
import { Connection } from 'invest-rpc'

import { loggerFactory } from 'invest-utils'
const logger = loggerFactory.getLogger('InvestRpcLink')

export interface InvestRpcLinkOptions {
    connection: Connection<{}>
    method?: string
}

export class InvestRpcLink extends ApolloLink {

    private connection: Connection<{}>
    private method: string

    constructor(options: InvestRpcLinkOptions) {
        super()
        this.connection = options.connection
        this.method = options.method || 'graphql'
    }

    request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
        logger.trace('InvestRpcLinkOptions.request', operation)

        // Operation has settings and getter... we need to drop those...

        const graphQlRequest: GraphQLRequest = {
            extensions: operation.extensions,
            operationName: operation.operationName,
            query: operation.query,
            variables: operation.variables,
            context: {}, // operation.getContext(),
            // This is not in GraphQLRequest... not sure if it has any use
            // key: operation.toKey()
        }

        console.log('hello')
        console.log(graphQlRequest)

        return new Observable(observer => {
            this.connection.request<FetchResult>(this.method, graphQlRequest)
                .then(v => {
                    observer.next(v)
                    observer.complete()
                }).catch(e => {
                    observer.error(e)
                })
        })

    }
}
