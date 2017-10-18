import { Handler } from 'vessel-rpc'

export function mergeHandler<S, T>(a: Handler<S>, b: Handler<T>): Handler<S & T> {
    return Object.assign(<Handler<S & T>>{}, a, b)
} 