export interface ActionDefinition {
    action: string,
    payload: {},
    title: string,
    description?: string
}

export interface UiPlugin {
    id: string,
    name: string,
    description: string,
    icon: string,
    url: string,
    actions: ActionDefinition[]
}

export type PluginActionDefinition = ActionDefinition & {
    pluginId: string
}