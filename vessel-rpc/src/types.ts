import { JsonRpcParameter } from './JsonRpcTypes'

export interface UnfulfilledPromise {
    resolve: (value?: {} | PromiseLike<{}> | undefined) => void, 
    reject: (value?: {} | PromiseLike<{}> | undefined) => void, 
}

export interface HandlerFunction<T> { (...params: JsonRpcParameter[]): Promise<T>}

export type Handler<S> = Object &  {
    [P in keyof S]: HandlerFunction<{}>
}
