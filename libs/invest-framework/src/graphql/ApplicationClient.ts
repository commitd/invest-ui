import { ApolloClient } from 'apollo-client'
import { ApolloCache } from 'apollo-cache'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { GraphQLSchema } from 'graphql'
import { createLocalSchema, InvestUiGraphQLRoot } from './LocalSchema'
import { createRemoteSchema } from './RemoteSchema'
import { combineLocalAndRemoteeSchema } from './CombinedSchema'
import { InvestSchemaLink, InvestAuthLink } from 'invest-graphql'
import { newGlobalHandler, GlobalHandler } from '../index'
import { HttpLink } from 'apollo-link-http'

class ApplicationClient {

    private graphQlUri: string

    private resolver: InvestUiGraphQLRoot

    private sessionProvider: () => string | undefined

    private localSchema: GraphQLSchema

    private remoteSchema: GraphQLSchema

    private combinedSchema: GraphQLSchema

    private authLink: InvestAuthLink

    private httpLink: HttpLink

    private combinedSchemaLink: InvestSchemaLink

    private client: ApolloClient<{}>

    private globalHandler: GlobalHandler

    constructor(graphQlUri: string, resolver: InvestUiGraphQLRoot, sessionProvider: () => string | undefined) {
        this.graphQlUri = graphQlUri
        this.resolver = resolver
        this.sessionProvider = sessionProvider
    }

    createClient() {

        // Setup the application's client
        this.authLink = new VesselAuthLink({
            sessionProvider: this.sessionProvider
        })

        this.httpLink = new HttpLink({
            uri: this.graphQlUri
        })

        // TODO: Should the application be able to access the local schema? 
        // If not (as here)... it could just be a simple http link (rather than the createRemoteSchema)
        this.client = new ApolloClient({
            link: this.authLink.concat(this.httpLink),
            cache: new InMemoryCache() as ApolloCache<NormalizedCacheObject>

        })
    }

    async createHandler() {
        // Setup the handler

        this.localSchema = createLocalSchema(this.resolver)
        this.remoteSchema = await createRemoteSchema(this.graphQlUri, this.authLink)
        this.combinedSchema = combineLocalAndRemoteeSchema(this.localSchema, this.remoteSchema)
        this.combinedSchemaLink = new InvestSchemaLink({
            schema: this.combinedSchema
        })

        this.globalHandler = newGlobalHandler(this.combinedSchemaLink, this.sessionProvider)
    }

    getApolloClient(): ApolloClient<{}> {
        return this.client
    }

    getGlobalGandler(): GlobalHandler {
        return this.globalHandler
    }
}

export default ApplicationClient