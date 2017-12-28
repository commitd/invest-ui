import { HttpLink } from 'apollo-link-http'
import { makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'
import { ApolloLink } from 'apollo-link'

export async function createRemoteSchema(uri: string, preLink?: ApolloLink): Promise<GraphQLSchema> {
    const httpLink = new HttpLink({ uri })

    let link: ApolloLink = httpLink
    if (preLink) {
        link = preLink.concat(httpLink)
    }

    const schema = await introspectSchema(link)

    return makeRemoteExecutableSchema({
        schema,
        link,
    })
}