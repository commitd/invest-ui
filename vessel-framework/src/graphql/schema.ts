import {
    GraphQLSchema,
    buildSchema
} from 'graphql'

const schema: GraphQLSchema = buildSchema(`
    type Query {
        vesselUi: VesselUi
    }

    type VesselUi {
        status: String
    }
`)

export default schema