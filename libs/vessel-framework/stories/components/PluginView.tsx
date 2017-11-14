import * as React from 'react'
import { storiesOf } from '@storybook/react'
import PluginView from '../../src/components/PluginView'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import { selectedPlugin, globalHandler } from '../fixtures'

storiesOf('PluginView', module)
    .addDecorator(withKnobs)
    .add('with selected', () => (
        <PluginView plugin={selectedPlugin} globalHandler={globalHandler} hide={boolean('Hidden', false)} />
    ))
