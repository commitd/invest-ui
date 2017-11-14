import { JsonRpcParameter } from './JsonRpcTypes'

/** A holder for the reject / resolve fucntions of a promise */
export interface UnfulfilledPromise {
    resolve: (value?: {} | PromiseLike<{}> | undefined) => void,
    reject: (value?: {} | PromiseLike<{}> | undefined) => void,
}

/** A function which will implement (handle) an RPC call. */
export interface HandlerFunction<T> {
    (...params: JsonRpcParameter[]): Promise<T> | T | void
}

/** A handler (ie class / object) which implements the interface of S */
export type Handler<S> = Object & {
    [P in keyof S]: HandlerFunction<{}>
}
