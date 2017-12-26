import { Reducer } from 'redux'
import { Action } from 'redux-actions'

import { Actions } from '../RootAction'
import { SetPluginPayload } from '../actions/plugins'
import * as Immutable from 'seamless-immutable'
import { UiPlugin } from 'invest-types'

export interface State {
    readonly uiPlugins: UiPlugin[]
}

export const initialState = Immutable.from({
    uiPlugins: []
})

export const reducer: Reducer<Immutable.ImmutableObject<State>> = (state = initialState, action: Action<{}>) => {
    switch (action.type) {
        case Actions.plugins.SET_PLUGINS:
            const payload = action.payload as SetPluginPayload
            return state.set('uiPlugins', payload.uiPlugins)
        default:
            break
    }
    return state
}