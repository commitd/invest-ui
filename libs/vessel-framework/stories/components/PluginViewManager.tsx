import * as React from 'react'
import { storiesOf } from '@storybook/react'
import PluginViewManager from '../../src/components/PluginViewManager'
import { selectedPlugin, plugins, globalHandler } from '../fixtures'

storiesOf('PluginViewManager', module)
    .add('with selected', () => (
        <PluginViewManager plugin={selectedPlugin} plugins={plugins} globalHandler={globalHandler} />
    ))
    .add('no selection', () => (
        <PluginViewManager
            plugins={plugins}
            globalHandler={globalHandler}
            fallback={<p>has a fallback</p>}
        />
    ))
    .add('no selection, no fallback', () => (
        <PluginViewManager plugins={plugins} globalHandler={globalHandler} />
    ))
    .add('empty', () => (
        <PluginViewManager plugins={[]} globalHandler={globalHandler} />
    ))