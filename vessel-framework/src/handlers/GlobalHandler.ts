import { ApolloClient } from 'react-apollo'
import { ExecutionResult } from 'graphql'

import { createGraphQLHandlerForClient } from 'vessel-graphql'
import { Handler, HandlerFunction } from 'vessel-rpc'

export class GlobalHandler implements Handler<GlobalHandler> {

    graphql: HandlerFunction<ExecutionResult>

    fetch: HandlerFunction<{}>

}

export function newGlobalHandler(client: ApolloClient, sessionProvider: () => string | undefined): GlobalHandler {
    const h = new GlobalHandler()
    h.graphql = createGraphQLHandlerForClient(client)
    h.fetch = function (input: RequestInfo, init?: RequestInit): Promise<Response> {
        // TODO: Add the Auth here

        if (init == null) {
            init = {}
        }

        if (init.headers == null) {
            init.headers = new Headers()
        }

        const session = sessionProvider()
        if (session != null) {
            init.headers.set('SESSION', session)
        } else {
            init.headers.delete('SESSION')
        }
        return fetch(input, init)
    }
    return h
}
