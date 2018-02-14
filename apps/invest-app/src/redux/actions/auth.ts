import { createAction } from 'redux-actions'

export interface SetAuthPayload {
    name: string,
    username: string,
    session: string,
    roles: string[],
}

export enum Actions {
    SET_AUTH = 'AUTH_SET',
    CLEAR_AUTH = 'AUTH_CLEAR'
}

export const actionCreators = {
    setAuth: createAction<SetAuthPayload>(Actions.SET_AUTH),
    clearAuth: createAction(Actions.CLEAR_AUTH)
}