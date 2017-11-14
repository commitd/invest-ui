import * as React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import Layout from '../../src/app/Layout'

const navBar = <p>NavBar</p>
const content = <p>Content</p>
const sidebar = <p>SideBar</p>

storiesOf('Layout', module)
    .addDecorator(withKnobs)
    .add('no sidebar, no navbar', () => <Layout open={boolean('Show', true)}> {content}</Layout>)
    .add('Sidebar, no navbar', () => <Layout open={boolean('Show', true)} sideBar={sidebar}> {content}</Layout>)
    .add('Sidebar and Navbar', () => (
        <Layout open={boolean('Show', true)} sideBar={sidebar} navBar={navBar}>
            {content}
        </Layout>
    )
    )