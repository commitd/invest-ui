import * as React from 'react'
import { graphql, QueryProps } from 'react-apollo'
import gql from 'graphql-tag'

import DatasetSelector from './DatasetSelector'

export interface OwnProps {
    selectedDataset?: string,
    provider?: string,
    database?: string,
    datasource?: string,
    onDatasetSelected?(id: string): void
}

interface Response {
    corpora: {
        id: string
        name: string
        description: string
        providers: {
            providerType: string
            datasource: string
            database: string
        }[]
    }[]
}

interface GqlProps {
    data?: QueryProps & Partial<Response>
}

type Props = OwnProps & GqlProps

class DatasetSelectorContainer extends React.Component<Props> {

    filteredDataset = () => {
        const { provider, database, datasource, data } = this.props

        if (!data || !data.corpora) {
            return []
        }

        if (provider == null && database == null && datasource == null) {
            return data.corpora
        }

        return data.corpora.filter(c => {
            const providers = c.providers

            if (!providers) {
                return false
            }

            if (provider != null && !providers.find(p => p.providerType === provider)) {
                return false
            }

            if (database != null && !providers.find(p => p.database === database)) {
                return false
            }

            if (datasource != null && !providers.find(p => p.datasource === datasource)) {
                return false
            }

            return true
        })
    }

    render() {
        const { data, selectedDataset, onDatasetSelected } = this.props

        if (!data || data.loading) {
            return <div />
        }

        const datasets = this.filteredDataset()

        return (
            <DatasetSelector
                selectedDataset={selectedDataset}
                onDatasetSelected={onDatasetSelected}
                datasets={datasets}
            />
        )
    }
}

// TODO: This is based on the Ketos graphql resolvers, these need to be moved generalica

const CORPUS_SUMMARY_QUERY = gql`
query Corpora {
  corpora {
    id
    name
    description
    providers {
        providerType
        datasource
        database
      }
  }
}
`

export default graphql<Response, OwnProps, Props>(CORPUS_SUMMARY_QUERY)(DatasetSelectorContainer)
