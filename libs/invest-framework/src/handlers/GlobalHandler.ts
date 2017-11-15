import { ApolloClient } from 'apollo-client'
import { ExecutionResult } from 'graphql'
import { Handler, HandlerFunction } from 'invest-rpc'
import { createGraphQLHandlerForClient } from 'invest-graphql'
import { simplifyResponse, SimpleResponse } from 'invest-utils'

export class GlobalHandler implements Handler<GlobalHandler> {

    graphql: HandlerFunction<ExecutionResult>

    fetch: HandlerFunction<SimpleResponse>
}

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<SimpleResponse>

type StringHeaderWithSession = {
    SESSION?: string
}

function createFetchHandler(sessionProvider: () => string | undefined): Fetch {
    // TODO: We should perhaps clone the init, before we modify to avoid leaking session back into the caller
    // TODO: Check if the input is for our server or another. Otherwise we are sending our session to other people

    return function (input: RequestInfo, init?: RequestInit): Promise<SimpleResponse> {
        if (init == null) {
            init = {}
        }

        if (init.headers == null) {
            init.headers = new Headers()
        }

        const session = sessionProvider()
        if (session != null) {
            if (init.headers instanceof Headers) {
                init.headers.set('SESSION', session)
            } else {
                const headers = init.headers as StringHeaderWithSession
                headers.SESSION = session
            }
        } else {
            if (init.headers instanceof Headers) {
                init.headers.delete('SESSION')
            } else {
                const headers = init.headers as StringHeaderWithSession
                delete headers.SESSION
            }
        }
        console.log(init.headers)
        return fetch(input, init).then(simplifyResponse)
    }
}

/**
 * Create a new handler for ourter application to fulfil its API to the Plugin
 * @param client the graph client 
 * @param sessionProvider callback to provide the current session (for auth in HTTP calls)
 */
export function newGlobalHandler(client: ApolloClient<{}>, sessionProvider: () => string | undefined): GlobalHandler {
    const h = new GlobalHandler()
    h.graphql = createGraphQLHandlerForClient(client)
    h.fetch = createFetchHandler(sessionProvider)
    return h
}
