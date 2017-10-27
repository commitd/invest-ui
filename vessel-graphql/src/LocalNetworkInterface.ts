import { NetworkInterface, Request } from 'react-apollo'
import { ExecutionResult, print, graphql, GraphQLSchema } from 'graphql'
const merge = require('lodash.merge')

export interface GraphQLRoot<Q= {}, M= {}, S= {}> {
    query: Q,
    mutation?: M,
    subscriptions?: S
}

export class LocalNetworkInterface<S extends GraphQLRoot> implements NetworkInterface {
    root: {}
    schema: GraphQLSchema

    constructor(schema: GraphQLSchema, root: S) {
        // The root doesnt want to have query:{ ... }, mutation: {} so we flatten the first level
        // here. 
        this.root = merge({}, root.subscriptions, root.mutation, root.query)
        this.schema = schema
    }

    query(request: Request): Promise<ExecutionResult> {
        return this._handle(
            print(request.query),
            request.operationName === null ? undefined : request.operationName,
            request.variables)
    }

    private _handle(query: string, operationName?: string, variables?: {}) {
        return graphql(this.schema, query, this.root, undefined, variables, operationName)
    }

}