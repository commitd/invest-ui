import {
    mergeSchemas
} from 'graphql-tools'
import { GraphQLSchema, printSchema } from 'graphql'

export function combineLocalAndRemoteeSchema(localSchema: GraphQLSchema, remoteSchema: GraphQLSchema): GraphQLSchema {
    const combined = mergeSchemas({
        schemas: [localSchema, remoteSchema],
    })
    // To debug: console.log(printSchema(combined))
    return combined
}
