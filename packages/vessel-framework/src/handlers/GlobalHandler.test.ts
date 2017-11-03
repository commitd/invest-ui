import { newGlobalHandler } from './GlobalHandler'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils'

const schema = makeExecutableSchema({
    typeDefs: `
        type User {
            id: Int
            name: String
        }

        type Query {
            user: User
        }

        type Mutation {
            deleteUser(name: String!): User
        }

` })
addMockFunctionsToSchema({ schema })
const client = new ApolloClient({
    networkInterface: mockNetworkInterfaceWithSchema({ schema })
})

describe('GlobaleHandler', () => {

    beforeEach(() => {
        global.fetch = jest.fn()
    })

    it('handles fetch ', () => {
        const handler = newGlobalHandler(client, () => '12345')
        handler.fetch()
    })
})