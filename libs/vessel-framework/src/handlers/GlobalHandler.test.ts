import { newGlobalHandler, Fetch } from './GlobalHandler'
import ApolloClient, { Request } from 'apollo-client'
import gql from 'graphql-tag'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils'

type GlobalWithFetch = NodeJS.Global & {
    fetch: Fetch
}

const fetchingGlobal = global as GlobalWithFetch

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
    let fetchMock: jest.Mock
    beforeEach(() => {
        fetchMock = jest.fn()
        fetchingGlobal.fetch = fetchMock
    })

    it('handles fetch', () => {
        const handler = newGlobalHandler(client, () => '12345')
        handler.fetch()

        expect(fetchMock).toBeCalled()
        // CHeck the headers are on
        const headers = fetchMock.mock.calls[0][1].headers as Headers
        expect(headers.get('SESSION')).toBe('12345')
    })

    it('handles graphql', () => {
        const handler = newGlobalHandler(client, () => '12345')
        var req: Request = {
            query: gql`query { user { id } }`
        }
        const v = handler.graphql(req)
        if (v instanceof Promise) {
            v.then(e => expect(e.data && e.data.user.id).toBeDefined())
        } else if (v != null) {
            expect(v.data && v.data.user.id).toBeDefined()
        } else {
            fail()
        }

    })
})