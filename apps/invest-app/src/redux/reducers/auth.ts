import { Reducer } from 'redux'
import { Action } from 'redux-actions'

import { Actions } from '../RootAction'
import { SetAuthPayload } from '../actions/auth'
import * as Immutable from 'seamless-immutable'

export interface State {
    readonly username?: string,
    readonly session?: string,
    readonly authenticated: boolean
    readonly name: string,
    readonly roles: string[],
}

export const initialState = Immutable.from({
    name: 'Guest',
    username: undefined,
    session: undefined,
    authenticated: false,
    roles: []
})

export const reducer: Reducer<Immutable.ImmutableObject<State>> = (state = initialState, action: Action<{}>) => {
    switch (action.type) {
        case Actions.auth.SET_AUTH:
            const payload = action.payload as SetAuthPayload
            return state.set('username', payload.username)
                .set('session', payload.session)
                .set('name', payload.name)
                .set('roles', payload.roles ? payload.roles : [])
                .set('authenticated', payload.session != null && payload.username != null)
        case Actions.auth.CLEAR_AUTH:
            return state.set('username', undefined)
                .set('session', undefined)
                .set('authenticated', false)
                .set('name', 'Guest')
                .set('roles', [])
        default:
            break
    }
    return state
}