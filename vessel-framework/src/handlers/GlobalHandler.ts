import { ApolloClient } from 'react-apollo'
import { ExecutionResult } from 'graphql'

import { createGraphQLHandlerForClient } from 'vessel-graphql'
import { Handler, HandlerFunction } from 'vessel-rpc'

export class GlobalHandler implements Handler<GlobalHandler> {

    graphql: HandlerFunction<ExecutionResult>

    fetch: HandlerFunction<{}> = function (input: RequestInfo, init?: RequestInit): Promise<Response> {
        // TODO: Add the Auth here
        return fetch(input, init)
    }

}

export function newGlobalHandler(client: ApolloClient): GlobalHandler {
    const h = new GlobalHandler()
    h.graphql = createGraphQLHandlerForClient(client)
    return h
}
