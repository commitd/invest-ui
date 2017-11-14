import * as React from 'react'

import { storiesOf } from '@storybook/react'

import './components/FallbackView'
import './components/IFrame'
import './components/PluginListSidebar'
import './components/PluginViewManager'
import './components/PluginView'

storiesOf('Welcome', module).add('Vessel Framework', () => (
    <div>
        <p>
            Vessel framework holds components which are useful for building the the outer Vessel application
            rather than than for plugins.
        </p>
    </div>
))
