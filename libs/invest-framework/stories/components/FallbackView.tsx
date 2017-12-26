import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { plugins } from '../fixtures'
import FallbackView from '../../src/components/FallbackView'

storiesOf('FallbackView', module)
    .add('index', () => (
        <FallbackView plugins={plugins} onSelectPlugin={action('onSelectPlugin')} />
    ))
    .add('empty', () => (
        <FallbackView plugins={[]} onSelectPlugin={action('onSelectPlugin')} />
    ))
