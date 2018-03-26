import * as React from 'react'

import { storiesOf } from '@storybook/react'

import TimelineChart from '../../../src/general/charts/TimelineChart'

const data = [
    { x: new Date(1982, 1, 1), y: 125 },
    { x: new Date(1987, 1, 1), y: 257 },
    { x: new Date(1993, 1, 1), y: 345 },
    { x: new Date(1997, 1, 1), y: 515 },
    { x: new Date(2001, 1, 1), y: 132 },
    { x: new Date(2005, 1, 1), y: 305 },
    { x: new Date(2011, 1, 1), y: 270 },
    { x: new Date(2015, 1, 1), y: 470 }
]

// TODO: lodash-es casues an error?
// storiesOf('TimelineChart', module)
//     .add('None', () => <div style={{ width: '100%', height: '500px' }}><TimelineChart data={data} /></div>)