import { ApolloLink, Operation, NextLink, FetchResult } from 'apollo-link'
import * as Observable from 'zen-observable'
import { Connection } from 'invest-rpc'

import { loggerFactory } from 'invest-utils'
const logger = loggerFactory.getLogger('InvestRpcLink')

export interface InvestRpcLinkOptions {
    connection: Connection<{}>
    method?: string
}

class VesselRpcLink extends ApolloLink {

    private connection: Connection<{}>
    private method: string

    constructor(options: InvestRpcLinkOptions) {
        super()
        this.connection = options.connection
        this.method = options.method || 'graphql'
    }

    request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
        logger.trace('InvestRpcLinkOptions.request', operation)
        return new Observable(observer => {
            this.connection.request<FetchResult>(this.method, operation)
                .then(v => {
                    observer.next(v)
                    observer.complete()
                }).catch(e => {
                    observer.error(e)
                })
        })

    }
}

export default VesselRpcLink