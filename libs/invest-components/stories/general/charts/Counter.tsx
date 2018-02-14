import * as React from 'react'

import { storiesOf } from '@storybook/react'

import Counter from '../../../src/general/charts/Counter'

storiesOf('Counter', module)
    .add('None', () => <Counter value={0} singular="item" plural="items" />)
    .add('One', () => <Counter value={1} singular="item" plural="items" />)
    .add('Several', () => <Counter value={10} singular="item" plural="items" />)
