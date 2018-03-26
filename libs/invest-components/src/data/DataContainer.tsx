import * as React from 'react'
import { graphql, DataProps } from 'react-apollo'
import { Segment, Divider, Button, Loader } from 'semantic-ui-react'

import { DocumentNode } from 'graphql'

type ControlProps = {
    showRefresh?: boolean
}

type InnerProps<Input, DataResponse> = ControlProps & Partial<DataProps<DataResponse, Input>>

class InnerDataContainer<Variables, Response> extends React.Component<InnerProps<Variables, Response>> {

    render() {
        const { data, children, showRefresh } = this.props

        if (!data || data.loading) {
            return <Loader active={true} />
        }

        const child = React.Children.only(children)
        const childWithProps = React.cloneElement(child, {
            data: data
        })

        const hasDataBar = showRefresh

        if (hasDataBar) {
            return (
                <React.Fragment>
                    <Segment basic={true}>
                        {showRefresh &&
                            <Button floated="right" content="Refresh" icon="refresh" onClick={this.handleRefresh} />}
                    </Segment>
                    <Divider hidden={true} />
                    {childWithProps}
                </React.Fragment>
            )
        } else {
            return childWithProps
        }
    }

    private handleRefresh = () => {
        if (this.props.data) {
            this.props.data.refetch()
        }
    }
}

type OuterProps<Variables> = { query: DocumentNode, variables: Variables } & ControlProps

class OuterDataContainer<Variables, Response> extends React.Component<OuterProps<Variables>> {

    render() {
        const { query, children, variables, showRefresh } = this.props

        return React.createElement(
            graphql<ControlProps, Response, Variables>(query, {
                options: { variables: variables, fetchPolicy: 'network-only' },
            })(InnerDataContainer),
            Object.assign({ showRefresh: showRefresh }, variables as Variables),
            children)
    }
}

export default function createDataContainer<Variables, Response>(query: DocumentNode) {
    return (props: { variables: Variables } & { children: React.ReactElement<{ data: Response }> } & ControlProps) => {
        // Would be nicer if the props wheren't variables={{ blah }} but is easier with Typescript like this

        const { children, variables, showRefresh } = props
        return (
            <OuterDataContainer query={query} variables={variables} showRefresh={showRefresh}>
                {children}
            </OuterDataContainer>
        )
    }
}
