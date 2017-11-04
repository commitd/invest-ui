import { UiPlugin, PluginWithIntent } from 'vessel-types'

export const plugins: UiPlugin[] = [
    {
        id: 'example1',
        actions: [],
        description: 'My example',
        name: 'Example',
        icon: 'add-circle',
        url: 'http://localhost:6006/'
    },
    {
        id: 'example2',
        actions: [],
        description: 'Another example',
        name: 'Tester',
        icon: 'add-circle',
        url: 'http://localhost:6006/'
    }
]

export const selectedPlugin: PluginWithIntent = {
    plugin: plugins[0],
    intent: {
        action: 'action',
        payload: {
            text: 'sample'
        }
    }
}

export const globalHandler = {}