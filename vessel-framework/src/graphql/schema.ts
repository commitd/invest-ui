import {
    GraphQLSchema,
    buildSchema,
    GraphQLResolveInfo
} from 'graphql'

export const vesselUiRoot = 'vesselUi'

export type GraphQLResolverCallback<Result, Source, Context>
    = (source: Source, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
export type GraphQLResolver<Result, Source = {}, Context = {}> = Result
    | Promise<Result>
    // This is a generaalisation of th GraphQLTypeResolver in graphql
    | GraphQLResolverCallback<Result, Source, Context>

export const schema: GraphQLSchema = buildSchema(`
    type Query {
        ${vesselUiRoot}: VesselUi
    }

    type VesselUi {
        status: String!,
        plugins: [Plugin!]!
    }

    type Plugin {
        id: String!,
        name: String!,
        description: String
    }

    type NavigateResponse {
        success: Boolean!
    }

    type Mutation {
        navigate(id: String!): NavigateResponse!
    }

    schema {
        query: Query,
        mutation: Mutation
    }
`)

// This should match the schema above!
export interface VesselUiGraphQLRoot {
    query: {
        vesselUi: {
            status: GraphQLResolver<string>
        }
    },
    mutation: {
        navigate(id: String): void
    }
}