import { createAction } from 'redux-actions'
import { UiPlugin } from 'invest-types'

export interface SetPluginPayload {
    uiPlugins: UiPlugin[]
}

export enum Actions {
    SET_PLUGINS = 'PLUGINS_SET'
}

export const actionCreators = {
    setPlugins: createAction<SetPluginPayload>(Actions.SET_PLUGINS)
}