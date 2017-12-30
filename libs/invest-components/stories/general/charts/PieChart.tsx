import * as React from 'react'

import { storiesOf } from '@storybook/react'

import PieChart from '../../../src/general/charts/PieChart'

const data = [
    { x: 'Group A', y: 400 }, { x: 'Group B', y: 300 },
    { x: 'Group C', y: 300 }, { x: 'Group D', y: 200 }
]

storiesOf('PieChart', module)
    .add('None', () => <div style={{ width: '500px', height: '500px' }}><PieChart data={data} /></div>)