import * as React from 'react'
import { graphql, QueryProps } from 'react-apollo'
import gql from 'graphql-tag'

import DatasetSelector from './DatasetSelector'

export interface OwnProps {
    selectedDataset?: string,
    onDatasetSelected?(id: string): void
}

interface Response {
    corpora: {
        id: string
        name: string
    }[]
}

interface GqlProps {
    data?: QueryProps & Partial<Response>
}

type Props = OwnProps & GqlProps

const container = (props: Props) => {
    const { data } = props

    if (!data || data.loading) {
        return <div />
    }

    return (
        <DatasetSelector
            selectedDataset={props.selectedDataset}
            onDatasetSelected={props.onDatasetSelected}
            datasets={data.corpora || []}
        />
    )
}

const CORPUS_SUMMARY_QUERY = gql`
query Corpora {
  corpora {
    id
    name
  }
}
`

export default graphql<Response, OwnProps, Props>(CORPUS_SUMMARY_QUERY)(container)
