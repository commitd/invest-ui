
import { HandlerFunction, JsonRpcParameter } from 'invest-rpc'
import { ExecutionResult } from 'graphql'
import { ApolloLink, FetchResult, GraphQLRequest, createOperation } from 'apollo-link'

export function createGraphQLHandler(link: ApolloLink): HandlerFunction<ExecutionResult> {
    return (...params: JsonRpcParameter[]) => {
        if (params.length !== 1) {
            return Promise.reject('Invalid number of arguments')
        }
        const request = params[0] as GraphQLRequest
        if (request != null) {

            const operation = createOperation(request.context, request)

            const o = link.request(operation)
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