import { Reducer } from 'redux'
import { Action } from 'redux-actions'

import  { Actions } from '../RootAction'
import * as Immutable from 'seamless-immutable'

export interface State {
    readonly noPayload: number,
    readonly withPayload: number,
}

export const initialState = Immutable.from({
    noPayload: 0,
    withPayload: 0
})

export const reducer: Reducer<Immutable.ImmutableObject<State>> = (state = initialState, action: Action<{}>) => {
    switch (action.type) {
        case Actions.example.EXAMPLE_NO_PAYLOAD:
            return state.update('noPayload', value => (value + 1))
        case Actions.example.EXAMPLE_WITH_PAYLOAD:
            return state.update('withPayload', value => (value + 1))
        default:
            break
    }
    return state
}