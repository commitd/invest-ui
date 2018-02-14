import { ApolloLink, Operation, NextLink, FetchResult } from 'apollo-link'
import * as Observable from 'zen-observable'

import { loggerFactory } from 'invest-utils'
const logger = loggerFactory.getLogger('InvestAuthLink')

export interface InvestAuthLinkOptions {
    sessionheader?: string,
    sessionProvider(): string | undefined
}

export class InvestAuthLink extends ApolloLink {

    private sessionProvider: () => string | undefined
    private sessionheader: string

    constructor(options: InvestAuthLinkOptions) {
        super()
        this.sessionProvider = options.sessionProvider
        this.sessionheader = options.sessionheader || 'SESSION'
    }

    request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
        logger.trace('InvestAuthLink.request', operation)
        operation.setContext((context: Record<string, {}>) => ({
            headers: {
                [this.sessionheader]: this.sessionProvider(),
            },
        }))

        if (forward) {
            return forward(operation)
        } else {
            return null
        }
    }
}
