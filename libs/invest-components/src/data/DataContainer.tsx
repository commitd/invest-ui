import * as React from 'react'
import { graphql, QueryProps } from 'react-apollo'
import { Loader } from 'semantic-ui-react'

import { DocumentNode } from 'graphql'

type Props<Input, Response> = Input & {
    data?: QueryProps & Partial<Response>
}

class InnerDataContainer<Variables, Response> extends React.Component<Props<Variables, Response>> {

    render() {
        const { data, children } = this.props

        if (!data || data.loading) {
            return <Loader active={true} />
        }

        const child = React.Children.only(children)
        return React.cloneElement(child, {
            data: data
        })
    }
}

type OuterProps<Variables> = { query: DocumentNode, variables: Variables }

class OuterDataContainer<Variables, Response> extends React.Component<OuterProps<Variables>> {

    render() {
        const { query, children, variables } = this.props

        return React.createElement(
            graphql<Response, Variables>(query, {
                options: { variables: variables, fetchPolicy: 'network-only' },
            })(InnerDataContainer),
            variables as Variables,
            children)
    }
}

export default function createDataContainer<Variables, Response>(query: DocumentNode) {
    return (props: { variables: Variables } & { children: React.ReactElement<{ data: Response }> }) => {
        // Would be nicer if the props wheren't variables={{ blah }} but is easiler with Typescript like this

        const { children, variables } = props
        return <OuterDataContainer query={query} variables={variables}>{children}</OuterDataContainer>
    }
}
