import { JsonRpcParameter } from './JsonRpcTypes'

export interface UnfulfilledPromise {
    resolve: (value?: {} | PromiseLike<{}> | undefined) => void, 
    reject: (value?: {} | PromiseLike<{}> | undefined) => void, 
}

export interface HandlerFunction { (...params: JsonRpcParameter[]): Promise<{}>}

export type Handler<S> = Object &  {
    [P in keyof S]: HandlerFunction
}
