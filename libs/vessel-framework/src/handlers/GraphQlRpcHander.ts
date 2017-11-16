
import { HandlerFunction, JsonRpcParameter } from 'vessel-rpc'
import { ExecutionResult } from 'graphql'
import { ApolloLink, Operation, FetchResult } from 'apollo-link'

// // We are intercepting at the network interface level... not at the client level. This is repeating the work..
// TODO: but perhaps we shoud be doing it this way? Then we only have a redux store in the parent.
// However 
// We'd need to proxy the apologclient... (or just provide a mutrate / query api )?
// export const createGraphQLHandlerForClient  = (client: ApolloClient) => {
//     return (...params: JsonRpcParameter[]) =>  {
//         if (params.length !== 1) {
//             return Promise.reject('Invalid number of arguments')
//         }
//         return client.query(params[0])
//     }
// }

// export type NetworkInferfaceHandlerFunctionCreator = (networkInterface: NetworkInterface)
//     => HandlerFunction<ExecutionResult>

// export type ClientHandlerFunctionCreator = (client: ApolloClient<{}>)
//     => HandlerFunction<ExecutionResult>

// export const createGraphQLHandlerForNetworkInterface: NetworkInferfaceHandlerFunctionCreator =
//     (networkInterface: NetworkInterface) => {
//         return (...params: JsonRpcParameter[]) => {
//             if (params.length !== 1) {
//                 return Promise.reject('Invalid number of arguments')
//             }
//             const request = params[0]
//             if (request != null) {
//                 return networkInterface.query(request)
//             } else {
//                 return Promise.reject('No request')
//             }
//         }
//     }

// export const createGraphQLHandlerForClient: ClientHandlerFunctionCreator
//     = (client: ApolloClient<{}>) => createGraphQLHandlerForNetworkInterface(client..networkInterface)

export function createGraphQLHandler(link: ApolloLink): HandlerFunction<ExecutionResult> {
    return (...params: JsonRpcParameter[]) => {
        if (params.length !== 1) {
            return Promise.reject('Invalid number of arguments')
        }
        const request = params[0] as Operation
        if (request != null) {
            // TODO: Is this ok for concatenated links?
            const o = link.request(request)
            if (o == null) {
                return Promise.reject('Link did not handle the result')
            } else {
                let value: ExecutionResult
                return new Promise((resolve, reject) => {
                    o.subscribe({
                        next: (v: FetchResult) => {
                            // Take the last value... we could through an error if we have multiple
                            value = v
                        },
                        complete: () => {
                            if (value == null) {
                                reject('Null result from graphql')
                            } else {
                                resolve(value)
                            }
                        },
                        error: (e: {}) => {
                            reject(e)
                        }
                    })
                })
            }
        } else {
            return Promise.reject('No request')
        }
    }
}