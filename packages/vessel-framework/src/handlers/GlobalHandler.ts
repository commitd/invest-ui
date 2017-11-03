import { ApolloClient } from 'react-apollo'
import { ExecutionResult } from 'graphql'

import { loggerFactory } from 'vessel-utils'
import { Handler, HandlerFunction } from 'vessel-rpc'
import { createGraphQLHandlerForClient } from 'vessel-graphql'

export class GlobalHandler implements Handler<GlobalHandler> {

    graphql: HandlerFunction<ExecutionResult>

    fetch: HandlerFunction<{}>

}

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>

function createFetchHandler(sessionProvider: () => string | undefined): Fetch {
    // TODO: We should perhaps clone the init, before we modify to avoid leaking session back into the caller
    // TODO: Check if the input is for our server or another. Otherwise we are sending our session to other people

    return function (input: RequestInfo, init?: RequestInit): Promise<Response> {
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
}

export function newGlobalHandler(client: ApolloClient, sessionProvider: () => string | undefined): GlobalHandler {
    const h = new GlobalHandler()
    h.graphql = createGraphQLHandlerForClient(client)
    h.fetch = createFetchHandler(sessionProvider)
    return h
}
