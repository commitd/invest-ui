import {
    GraphQLSchema,
    buildSchema,
    GraphQLResolveInfo
} from 'graphql'

import { PluginActionDefinition } from 'vessel-types'

/** Route object in the graphql schema for Vessel UI  */
export const vesselUiRoot = 'vesselUi'

/** Type of a callback which will statify a query */
export type QueryResolverCallback<Result, Arguments, Source, Context>
    = (args: Arguments, source: Source, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
/** Type for a graphql resolver which will statify a query */
export type QueryResolver<Result, Arguments = {}, Source = {}, Context = {}> = Result
    | Promise<Result>
    // This is a generaalisation of th GraphQLTypeResolver in graphql
    | QueryResolverCallback<Result, Arguments, Source, Context>

/** Type of a callback which will statify a mutation */
export type MutationResolverCallback<Result, Arguments, Context>
    = (args: Arguments, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
/** Type for a graphql resolver which will statify a mutation */
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
        # TODO: For the moment paylload is a JSOn.strinfify()... 
        # but it can be better maanged with a customer JSONScalar type 
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

/**  Arguments of query action */
export type QueryActionInput = {
    action: string
}

/** Results of query.actiosn */
export type QueryActionOutput = {
    definitions: PluginActionDefinition[]
}

/** Arguments of navigate() */
export type NavigateInput = {
    pluginId: string,
    action?: string
    payload?: string
}

/** Results of navigate() */
export type NavigateOutput = {
    success: boolean
}

/** JS representation of the GraphQL schema */
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