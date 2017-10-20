import {
    graphql,
    GraphQLSchema,
    ExecutionResult
} from 'graphql'
import { JsonRpcParameter, HandlerFunction } from 'vessel-rpc'

export function createVesselUiGraphQLHandler(schema: GraphQLSchema): HandlerFunction<ExecutionResult> {
    return function (query: JsonRpcParameter[]): Promise<ExecutionResult> {
        if (query.length !== 1) {
            return Promise.reject('Expected single paramter')
        }
        // q = `{
        //     __schema {
        //       types {
        //         name
        //       }
        //     }
        //   }`
        const root = {
            vesselUi: {
                status: () => 'ok'
            }
        }
        return graphql(schema, q, root)

    }
}