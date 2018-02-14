import { PromiseCompletion, ResolverMeta, ResolverActionCreator } from './types'
import { createAction } from 'redux-actions'
import { Dispatch } from 'redux'

/**
 * Create an action (with the ationcreator and payload provided) and dispatch it.
 * The meta element of the action will be a resolve, reject functions from the promise 
 * (returned in this function) so taht a saga (for example) can resolve the promise
 * and hence 'return a value' to this function.
 * 
 * We do this so we can take a call from outside 'redux' and pass it into redux (in order
 * to access the store etc) whislt returning a promise to the original caller.  
 *  
 * @param dispatch store dispatcher
 * @param actionCreator the action creator function which will be used to create the action
 * @param payload the payload to supplied to the action creator
 * @returns a promise to be resolved in a the saga
 */
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

/** Create meta element of an action payload for resolver actions. */
export function resolverMeta<T>(payload: {}, meta: PromiseCompletion<T>): ResolverMeta<T> {
    return {
        promise: meta
    }
}

/** A helper for generating actioncreators which work as 'resolver actions'  */
export function createResolverAction<Payload, Response>(action: string) {
    return createAction<Payload, ResolverMeta<Response>, Payload, PromiseCompletion<Response>>
        (action, (payload: Payload) => payload, resolverMeta)
}