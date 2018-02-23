import {
    GraphQLResolveInfo
} from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'
import { PluginActionDefinition } from 'invest-types'
import { GraphQLSchema } from 'graphql/type/schema'

/** Route object in the graphql schema for Invest UI  */
export const investUiRoot = 'investUi'

/** Type of a callback which will statify a query */
export type QueryResolverCallback<Result, Arguments, Source, Context>
    = (args: Arguments, source: Source, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
/** Type for a graphql resolver which will statify a query */
export type QueryResolver<Result, Arguments = {}, Source = {}, Context = {}> = Result
    | Promise<Result>
    // This is a generalisation of th GraphQLTypeResolver in graphql
    | QueryResolverCallback<Result, Arguments, Source, Context>

/** Type of a callback which will statify a mutation */
export type MutationResolverCallback<Result, Arguments, Context>
    = (args: Arguments, context: Context, info: GraphQLResolveInfo) => Result | Promise<Result>
/** Type for a graphql resolver which will statify a mutation */
export type MutationResolver<Result, Arguments = {}, Context = {}> = Result | Promise<Result>
    | MutationResolverCallback<Result, Arguments, Context>

const typeDefinition = `
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

    # Schema (likely no need to amend)

    type Query {
        ${investUiRoot}: VesselUiQuery
    }

    type Mutation {
        # See issue tracker better maanged with a customer JSONScalar type 
        # see https://stackoverflow.com/questions/45842544/graphql-objecttype-with-dynamic-fields-based-on-arguments
        navigateToPlugin(input: NavigateInput): NavigateOutput!    }

    schema {
        query: Query,
        mutation: Mutation
    }
`

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
export interface InvestUiGraphQLRoot {
    query: {
        investUi: {
            status: QueryResolver<string>,
            actions: QueryResolver<QueryActionOutput, { input: QueryActionInput }>
        },
    }
    mutation: {
        investUi: {
            navigate: MutationResolverCallback<NavigateOutput, { input: NavigateInput }, {}>
        }
    }
}

export function createLocalSchema(resolver: InvestUiGraphQLRoot): GraphQLSchema {
    return makeExecutableSchema({
        typeDefs: [typeDefinition],
        resolvers: {
            Query: {
                investUi: () => resolver.query.investUi
            },
            Mutation: {
                navigateToPlugin: (obj, args: { input: NavigateInput }, context, info) => {
                    return resolver.mutation.investUi.navigate(args, context, info)
                }
            }
        }
    })
}