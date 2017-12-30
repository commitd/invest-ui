import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import DatasetSelector from '../../src/invest/dataselector/DatasetSelector'

const datasets = [
    {
        id: 'one',
        name: 'One'
    },
    {
        id: 'two',
        name: 'Two'
    },
    {
        id: 'three',
        name: 'three'
    }
]

storiesOf('DatasetSelector', module)
    .add('No datasets', () => <DatasetSelector datasets={[]} onDatasetSelected={action('onDatasetSelected')} />)
    .add('One dataset, auto select', () =>
        <DatasetSelector datasets={[datasets[0]]} onDatasetSelected={action('onDatasetSelected')} />)
    .add('Non-selected', () => <DatasetSelector datasets={datasets} onDatasetSelected={action('onDatasetSelected')} />)
    .add('Selected', () => (
        <DatasetSelector
            datasets={datasets}
            selectedDataset={datasets[1].id}
            onDatasetSelected={action('onDatasetSelected')}
        />))
