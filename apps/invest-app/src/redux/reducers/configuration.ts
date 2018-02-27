import { Reducer } from 'redux'
import { Action } from 'redux-actions'

import { Actions } from '../RootAction'
import { SetConfigurationPayload } from '../actions/configuration'
import * as Immutable from 'seamless-immutable'
import { InvestConfiguration } from 'invest-types'

export interface State {
    readonly configuration: InvestConfiguration
}

export const initialState = Immutable.from({
    configuration: {
        title: 'Invest',
        serverUrl: 'http://localhost:8080',
        settings: {}
    }
})

export const reducer: Reducer<Immutable.ImmutableObject<State>> = (state = initialState, action: Action<{}>) => {
    switch (action.type) {
        case Actions.configuration.SET_CONFIGURATION:
            const payload = action.payload as SetConfigurationPayload
            return state.set('configuration', payload.configuration)
        default:
            break
    }
    return state
}