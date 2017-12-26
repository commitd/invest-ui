import { PluginApi } from './PluginApi'
import { Connection } from 'invest-rpc'

import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils'

type State = {

}

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

describe('VesselPluginApi', () => {

    it('fetch is called', () => {
        const mockConnection = jest.fn<Connection<State>>(() => ({
            request: jest.fn()
        }))
        const conn = mockConnection()

        const api = new VesselPluginApi(client, conn)

        api.fetch('/api/hello')

        expect(conn.request).toBeCalledWith('fetch', '/api/hello', undefined)
    })

    it('client query is called', () => {
        const mockConnection = jest.fn<Connection<State>>(() => ({
            request: jest.fn()
        }))
        const conn = mockConnection()

        const api = new VesselPluginApi(client, conn)

        api.query({
            query: gql`{ user { name } }`,
        }).then(v => {
            expect(v.data).toBeDefined()
        })
    })

    // TODO: Doesn't work but I don't know where the failure is?
    // it('mutation  is called', () => {
    //     const mockConnection = jest.fn<Connection<State>>(() => ({
    //         request: jest.fn()
    //     }))
    //     const conn = mockConnection()

    //     const api = new VesselPluginApi(client, conn)

    //     api.mutate({
    //         mutation: gql`{ mutation { deleteUser(name: "example") { id } } }`,
    //     }).then(v => {
    //         expect(v.data).toBeDefined()
    //     })
    // })
})