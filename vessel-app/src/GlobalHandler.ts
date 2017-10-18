import { ApolloClient } from 'react-apollo'
import { ExecutionResult } from 'graphql'

import { createGraphQLHandlerForClient } from 'vessel-graphql'
import { Handler, HandlerFunction } from 'vessel-rpc'

export class GlobalHandler implements Handler<GlobalHandler> {

    graphql: HandlerFunction<ExecutionResult>

}

export function mergeHandler<S, T>(a: Handler<S>, b: Handler<T>): Handler<S & T> {
    return Object.assign(<Handler<S & T>> {}, a, b)
} 

export function newGlobalHandler(client: ApolloClient): GlobalHandler {
    const h = new GlobalHandler()
    h.graphql = createGraphQLHandlerForClient(client)
    return h
}
