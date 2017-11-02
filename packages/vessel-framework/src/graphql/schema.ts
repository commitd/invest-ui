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

    input QueryActionInput {
        action: String!
    }

    type QueryActionOutput {
        definitions: [PluginActionDefinition!]!
    }

    type VesselUiQuery {
        status: String!,
        actions(input: QueryActionInput): QueryActionOutput!
    }

    # Mutation specific

    input NavigateInput {
        pluginId: String!,
        action: String,
        payload: String
    }

    type NavigateOutput{
        success: Boolean!
    }

    type VesselUiMutation {
        # TODO: For the moment paylload is a JSOn.strinfify()... but it can be better maanged with a customer JSONScalar type 
        # see https://stackoverflow.com/questions/45842544/graphql-objecttype-with-dynamic-fields-based-on-arguments
        navigate(input: NavigateInput): NavigateOutput!
        
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

export type QueryActionInput = {
    action: string
}

export type QueryActionOutput = {
    definitions: PluginActionDefinition[]
}

export type NavigateInput = {
    pluginId: string,
    action?: string
    payload?: string
}

export type NavigateOutput = {
    success: boolean
}

export interface VesselUiGraphQLRoot {
    query: {
        vesselUi: {
            status: QueryResolver<string>,
            actions: QueryResolver<QueryActionOutput, { input: QueryActionInput }>
        },
    }
    mutation: {
        vesselUi: {
            navigate: MutationResolver<NavigateOutput, { input: NavigateInput }>
        }
    }
}