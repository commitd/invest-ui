import {
    GraphQLSchema,
    buildSchema,
    GraphQLResolveInfo
} from 'graphql'

export const vesselUiRoot = 'vesselUi'

export type QueryResolverCallback<Result, Source, Context>
    = (source: Source, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
export type QueryResolver<Result, Source = {}, Context = {}> = Result
    | Promise<Result>
    // This is a generaalisation of th GraphQLTypeResolver in graphql
    | QueryResolverCallback<Result, Source, Context>

export type MutationResolverCallback<Result, Arguments, Context>
    = (args: Arguments, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
export type MutationResolver<Result, Arguments = {}, Context = {}> = Result | Promise<Result>
    | MutationResolverCallback<Result, Arguments, Context>

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

    type VesselUiMutation {
        navigate(id: String!): NavigateResponse!
        
    }

    type Mutation {
        vesselUi: VesselUiMutation
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
            status: QueryResolver<string>
        }
    },
    mutation: {
        vesselUi: {
            navigate(args: { id: String }): MutationResolver<{ success: boolean }>
        }
    }
}