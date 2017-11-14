import * as React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import './app/Layout'
import './app/NavBar'
import './auth/Login'

storiesOf('Welcome', module).add('to Vessel Components', () =>
    (
        <div>
            <p>Vessel Components contains reusable react components which are not
                tried to any particular plugin or the application framework.</p>
        </div>
    )
)