import { ApolloLink, Operation, NextLink, FetchResult } from 'apollo-link'
import * as Observable from 'zen-observable'
import { GraphQLSchema, graphql } from 'graphql'
import { print } from 'graphql/language'
import { loggerFactory } from 'invest-utils'
const logger = loggerFactory.getLogger('VesselAuthLink')

export interface InvestSchemaLinkOptions {
    schema: GraphQLSchema
}

class InvestSchemaLink extends ApolloLink {

    private schema: GraphQLSchema

    constructor(options: InvestSchemaLinkOptions) {
        super()
        this.schema = options.schema
    }

    request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null {
        logger.trace('InvestLocalLink.request', operation)

        return new Observable(observer => {
            const request = print(operation.query)
            const result = graphql(
                this.schema,
                request, undefined,
                operation.getContext(),
                operation.variables,
                operation.operationName)

            result.then(r => {
                observer.next(r)
                observer.complete()
            }).catch(e => observer.error(e))
        })
    }
}

export default InvestSchemaLink