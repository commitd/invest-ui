import { NetworkInterface, Request } from 'react-apollo'
import { ExecutionResult, print, graphql, GraphQLSchema } from 'graphql'

export class LocalNetworkInterface<S> implements NetworkInterface {
    root: S
    schema: GraphQLSchema

    constructor(schema: GraphQLSchema, root: S) {
        this.root = root
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