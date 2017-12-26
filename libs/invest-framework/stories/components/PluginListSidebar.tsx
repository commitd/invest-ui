import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import PluginListSidebar from '../../src/components/PluginListSidebar'
import { plugins } from '../fixtures'

storiesOf('PluginListSidebar', module)
    .add('with selected', () => (
        <PluginListSidebar
            selectedPlugin={plugins[0]}
            plugins={plugins}
            onPluginSelected={action('onPluginSelected')}
        />
    ))
    .add('no selection', () => (
        <PluginListSidebar
            plugins={plugins}
            onPluginSelected={action('onPluginSelected')}
        />
    ))