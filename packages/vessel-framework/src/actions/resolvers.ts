import { PromiseCompletion, ResolverMeta, ResolverActionCreator } from './types'
import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'

export function dispatchAsAction<Payload, Response>(
    dispatch: Dispatch<{}>,
    actionCreator: ResolverActionCreator<Payload, Response>,
    payload: Payload)
    : Promise<Response> {
    return new Promise((resolve, reject) => {
        const action = actionCreator(payload, { resolve, reject })
        dispatch(action)
    })
}

export function resolverMeta<T>(payload: {}, meta: PromiseCompletion<T>): ResolverMeta<T> {
    return {
        promise: meta
    }
}

export function createResolverAction<Payload, Response>(action: string) {
    return createAction<Payload, ResolverMeta<Response>, Payload, PromiseCompletion<Response>>
        (action, (payload: Payload) => payload, resolverMeta)
}