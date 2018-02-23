import { createAction } from 'redux-actions'

export interface SetAuthPayload {
    name: string,
    username: string,
    session: string,
    roles: string[],
}

export interface SetAuthenticationModePayload {
    enabled: boolean
}

export enum Actions {
    SET_AUTH = 'AUTH_SET',
    CLEAR_AUTH = 'AUTH_CLEAR',
    SET_AUTHENTICATION_MODE = 'AUTHENTICATION_MODE_SET',

}

export const actionCreators = {
    setAuth: createAction<SetAuthPayload>(Actions.SET_AUTH),
    clearAuth: createAction(Actions.CLEAR_AUTH),
    setAuthenticationMode: createAction<SetAuthenticationModePayload>(Actions.SET_AUTHENTICATION_MODE),

}