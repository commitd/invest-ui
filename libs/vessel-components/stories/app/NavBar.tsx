import * as React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import { withKnobs, text } from '@storybook/addon-knobs'
import NavBar from '../../src/app/NavBar'

const right = <span>Right</span>

storiesOf('Navbar', module)
    .addDecorator(withKnobs)
    .add('no right ', () => <NavBar title={text('Title', 'Nav title')} />)
    .add('with right', () => <NavBar title={text('Title', 'Nav title')} rightArea={right} />)