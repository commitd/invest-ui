import {
    mergeSchemas
} from 'graphql-tools'
import { GraphQLSchema } from 'graphql'

export function combineLocalAndRemoteeSchema(localSchema: GraphQLSchema, remoteSchema: GraphQLSchema): GraphQLSchema {
    return mergeSchemas({
        schemas: [localSchema, remoteSchema]
    })
}
