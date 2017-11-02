
import { ActionMeta } from 'redux-actions'

export type PromiseCompletion<T> = {
    resolve(t?: T): void,
    reject(reason: {}): void
}

// Meta type for actions which support the RPC handler
export type ResolverMeta<T> = {
    promise: PromiseCompletion<T>
}

export type ResolverAction<Payload, Result> = ActionMeta<Payload, ResolverMeta<Result>>
export type ResolverActionCreator<Payload, Response> =
    (payload: Payload, meta: PromiseCompletion<Response>) => ReduxActions.ActionMeta<Payload, ResolverMeta<Response>>