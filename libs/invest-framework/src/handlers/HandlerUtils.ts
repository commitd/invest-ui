import { Handler } from 'invest-rpc'

/**
 * Merge two handlers together to create another handler.
 * 
 * NOte that handlers on b will override (take precedence) over those on a (if there are any functions in common).
 * 
 * @param a handler
 * @param b handler
 */
export function mergeHandler<S, T>(a: Handler<S>, b: Handler<T>): Handler<S & T> {
    return Object.assign(<Handler<S & T>>{}, a, b)
} 