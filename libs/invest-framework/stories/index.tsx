import * as React from 'react'

import { storiesOf } from '@storybook/react'

import './components/FallbackView'
import './components/IFrame'
import './components/PluginListSidebar'
import './components/PluginViewManager'
import './components/PluginView'

storiesOf('Welcome', module).add('Invest Framework', () => (
    <div>
        <p>
            Invest Framework holds components which are useful for building the the outer frame application
            rather than than for plugins.
        </p>
    </div>
))
