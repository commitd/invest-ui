import { ActionMeta } from 'redux-actions'

/** The resolve, reject functons which are from the Promise */
export type PromiseCompletion<T> = {
    resolve(t?: T): void,
    reject(reason: {}): void
}

/* Meta type for actions which support the RPC handler */
export type ResolverMeta<T> = {
    promise: PromiseCompletion<T>
}

/** An action which has meta containing promise functions  */
export type ResolverAction<Payload, Result> = ActionMeta<Payload, ResolverMeta<Result>>
/** An action creator for resolver actions (with promise to resolve in meta) */
export type ResolverActionCreator<Payload, Result> =
    (payload: Payload, meta: PromiseCompletion<Result>) => ResolverAction<Payload, Result>