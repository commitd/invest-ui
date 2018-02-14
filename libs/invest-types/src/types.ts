import { SemanticICONS } from 'semantic-ui-react'

/** A definition of an action which a UiPlugin supports */
export interface ActionDefinition {
    /** The action, for example document.view */
    action: string,
    /** A 'schema' definition of the supported payload. This is not yet implemented! */
    payload: {},
    /** 
     * A title which can be displayed the the user. 
     * For example it may say 'View document text' or 'View document metadata' 
     */
    title: string,
    /** A short descriptions (no more than 2 sentences) */
    description?: string
}

/** A view Plugin available in the UI */
export interface UiPlugin {
    /** Unique id of the plugin */
    id: string,
    /** Displable name of plugin */
    name: string,
    /** Short description of plugin */
    description: string,
    /** The  ui icon for the plugin */
    icon: SemanticICONS,
    /** The url where thr plugin can be found (eg if you navigate here it would display the plugin) */
    url: string,
    /** A list of action definitions which this plugin supports. */
    actions: ActionDefinition[]
    /** A list of roles the user needs before this plugin can be used. */
    roles: string[]
}

/** An action definition which is tied to its supported plugin */
export type PluginActionDefinition = ActionDefinition & {
    pluginId: string
}

/** An intent (a la Android) is something sent to a plugin to effect change. */
export interface Intent {
    /** The action to send to the plugin */
    action: string,
    /** Optional data payload */
    payload?: {},
}

/** In effect a 'view state' a plugin together with an action which together define its display */
export interface PluginWithIntent {
    /** The plugin which is the destination */
    plugin: UiPlugin,
    /** The intent to send to the plugin */
    intent?: Intent,
}
