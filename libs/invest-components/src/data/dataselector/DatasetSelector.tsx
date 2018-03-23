import * as React from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import Ellipsis from '../../general/utils/Ellipsis'

export interface Dataset {
    id: string,
    name: string,
    description: string
}

export interface OwnProps {
    datasets: Dataset[],
    selectedDataset?: string,
    onDatasetSelected?(id: String): void
}

export type Props = OwnProps

class DatasetSelector extends React.Component<Props> {

    handleDatasetSelected = (e: {}, data: { value: string }) => {
        if (this.props.onDatasetSelected) {
            this.props.onDatasetSelected(data.value)
        }
    }

    componentWillMount() {
        this.checkIfSingle(this.props)
    }

    componentWillReceiveProps(nextProps: Props) {
        this.checkIfSingle(nextProps)
    }

    checkIfSingle(props: Props) {
        // If we only have at least one dataset we auto select that
        if (props.selectedDataset == null
            && (props.datasets != null && props.datasets.length >= 1)
            && props.onDatasetSelected != null) {
            props.onDatasetSelected(props.datasets[0].id)
        }
    }

    render() {

        const { datasets, selectedDataset } = this.props

        const dataset = selectedDataset && datasets.find(d => d.id === selectedDataset)

        const datasetOptions = datasets.map(d => (
            { id: d.id, text: d.name, value: d.id }
        ))
        return (
            <Menu vertical={false}>
                <Dropdown
                    item={true}
                    text={dataset ? dataset.name : 'Select dataset'}
                    selection={true}
                    options={datasetOptions}
                    onChange={this.handleDatasetSelected}
                />
                {dataset && dataset.description &&
                    <Menu.Item>
                        <i><Ellipsis text={dataset.description} size={64} /></i>
                    </Menu.Item>
                }
            </Menu>
        )
    }
}

export default DatasetSelector