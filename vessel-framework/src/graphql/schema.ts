import {
    GraphQLSchema,
    buildSchema,
    GraphQLResolveInfo
} from 'graphql'

import { PluginActionDefinition } from 'vessel-types'

export const vesselUiRoot = 'vesselUi'

export type QueryResolverCallback<Result, Arguments, Source, Context>
    = (args: Arguments, source: Source, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
export type QueryResolver<Result, Arguments = {}, Source = {}, Context = {}> = Result
    | Promise<Result>
    // This is a generaalisation of th GraphQLTypeResolver in graphql
    | QueryResolverCallback<Result, Arguments, Source, Context>

export type MutationResolverCallback<Result, Arguments, Context>
    = (args: Arguments, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
export type MutationResolver<Result, Arguments = {}, Context = {}> = Result | Promise<Result>
    | MutationResolverCallback<Result, Arguments, Context>

export const schema: GraphQLSchema = buildSchema(`

    type Plugin {
        id: String!,
        name: String!,
        description: String,
    }

    type PluginActionDefinition  {
        pluginId: String!,
        title: String!,
        description: String,
        action: String,
    }

    # Query specific

    type VesselUiQuery {
        status: String!,
        actions(action: String): [PluginActionDefinition!]!
    }

    # Mutation specific

    type NavigateResponse {
        success: Boolean!
    }

    type VesselUiMutation {
        # TODO: For the moment paylload is a JSOn.strinfify()... but it can be better maanged with a customer JSONScalar type 
        # see https://stackoverflow.com/questions/45842544/graphql-objecttype-with-dynamic-fields-based-on-arguments
        navigate(pluginId: String!, action: String, payload: String): NavigateResponse!
        
    }

    # Schema (likely no need to amend)

    type Query {
        ${vesselUiRoot}: VesselUiQuery
    }

    type Mutation {
        ${vesselUiRoot}: VesselUiMutation
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
            status: QueryResolver<string>,
            actions: QueryResolver<PluginActionDefinition[], { action: string }>
        },
    }
    mutation: {
        vesselUi: {
            navigate: MutationResolver<{ success: boolean }, { pluginId: string, action?: string, payload?: String }>
        }
    }
}