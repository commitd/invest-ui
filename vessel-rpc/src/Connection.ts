const uniqueId = require('uniqueid')
import * as shortid from 'shortid'

import { JsonRpcId, JsonRpcRequest, JsonRpcMethod, JsonRpcParameter, 
    JsonRpcResult, JsonRpcNotification, 
    JsonRpcErrorCode,
    JsonRpcMessage, JsonRpcSuccess, JsonRpcFailure } from './JsonRpcTypes'

import { Handler, UnfulfilledPromise } from './types'

// TODO: We don't deal with batching here..

/**
 * A JSON-RPC 2.0 client that sends requests and notifications over `window.postMessage`.
 */
export default class Connection<S> {

    private sourceWindow: Window
    private targetWindow: Window
    private targetWindowOrigin: string
    private handler: Handler<S>

    private _instanceId: String = shortid()
    private uniqueIdGenerator = uniqueId(this._instanceId + '_')
    private _dispatches = new Map<JsonRpcId, UnfulfilledPromise>()

    /** Construct a Client instance.
     * @param {Window=} targetWindow - The default server window.
     */
    constructor(sourceWindow: Window, targetWindow: Window, handler: Handler<S>) {
        this.targetWindow = targetWindow
        this.sourceWindow = sourceWindow
        this.handler = handler

        // Best guess is that it's here.. but if we have permission we can find out more
        this.targetWindowOrigin = '*'
        try {
            let origin = this.targetWindow.location.origin
            if (origin !== 'null' && origin !== 'about://' /* IE */) {
                this.targetWindowOrigin = origin
            }
        } catch (e) {
            // Security denies us... leave as is
        }
    }   

    handleMessage = (e: MessageEvent) => {
        if (!e.data || !e.data.jsonrpc || e.target !== this.sourceWindow || e.source !== this.targetWindow) {
            return
        }

        const message = e.data as JsonRpcMessage

        // If a request or notification we need to pass to handler
        // if a response or error then we need to deal with, if we have an id for that

        if ( (<JsonRpcNotification<{}>> message).method ) {
            this._handleRequestOrNotification(<JsonRpcNotification<{}> | JsonRpcRequest<{}>> message)
        } else {
            this._handleResponse(<JsonRpcSuccess<{}> | JsonRpcFailure<{}>> message)
        }
        
    }

    /** Start listening for `message` events (to receive results of requests).
     * @param {Window} window - The browser window to which a handler will be attached.
     */
    start() {
        this.sourceWindow.addEventListener('message', this.handleMessage)
        this.sourceWindow.addEventListener('onunload', this.stop)
    }

    /** Stop listening for `message` events.
     */
    stop() {
        this.sourceWindow.removeEventListener('message', this.handleMessage)
        this.sourceWindow.removeEventListener('onunload', this.stop)   
    }

    /** Invoke a named RPC method on the server window, ignoring the result.
     * 
     */
    notify(method: JsonRpcMethod, ...params: JsonRpcParameter[]): Promise<void> {
        return this._dispatch<void>(method, undefined, ...params)
    }

    request<T>(method: JsonRpcMethod, ...params: JsonRpcParameter[]): Promise<T > {
        return this._dispatch(method, this.uniqueIdGenerator(), ...params)
    }

    private _handleResponse(response: JsonRpcSuccess<{}> | JsonRpcFailure<{}>) {
        // Is this a response to our message? 
        const dispatch = this._dispatches.get(response.id)
        this._dispatches.delete(response.id)
        if (dispatch && dispatch.resolve && dispatch.reject) {
            if ((<JsonRpcFailure<{}>> response).error) {
                dispatch.reject((<JsonRpcFailure<{}>> response).error)
            } else {
                dispatch.resolve((<JsonRpcSuccess<{}>> response).result)
            }
        } else {
            // TODO Log
        }
    }

    private _handleRequestOrNotification(message: JsonRpcRequest<{}> | JsonRpcNotification<{}>) {
        if (this.handler.hasOwnProperty(message.method)) {
            let p: Promise<{}>
            if (message.params === undefined) {
                p = this.handler[message.method]()
            } else if (message.params instanceof Array) {
                p = this.handler[message.method](...message.params)
            } else {
                p = this.handler[message.method](message.params)
            }
            
            // If this is a request, we need to send the result back
            if ( (<JsonRpcRequest<{}>> message ).id) {
                const id = (<JsonRpcRequest<{}>> message ).id
                p.then(
                    value => this._replyWithSuccess(id, value),
                    reason => {
                        // TODO: Log this error
                        this._replyWithError(id, JsonRpcErrorCode.INTERNAL_ERROR, 'Handling error', reason)
                    }
                )   
            } 
        } else {
            // TODO: Log this error
            if ( (<JsonRpcRequest<{}>> message ).id) {
                const id = (<JsonRpcRequest<{}>> message ).id
                this._replyWithError(id, 
                                     JsonRpcErrorCode.INTERNAL_ERROR, 
                                     'Cant find method: ' + message.method, 
                                     undefined)
            } 
        }
    }
    
    private _replyWithSuccess(id: JsonRpcId, data: JsonRpcResult) {
        const message: JsonRpcSuccess<{}> = {
            jsonrpc: '2.0',
            id,
            result: data
        }
        this._send(message)
    }

    private _replyWithError(id: JsonRpcId, code: number, message: string, data?: JsonRpcResult) {
        const failure: JsonRpcFailure<{}> = {
            jsonrpc: '2.0',
            id,
            error: {
                code,
                message,
                data
            }
        }
        this._send(failure)
    }

    private _dispatch<T>(method: JsonRpcMethod, id: JsonRpcId, ...params: JsonRpcParameter[]): Promise< T> {
        return new Promise((resolve, reject) => {
            if (typeof id !== 'undefined') {
                this._dispatches.set(id, {
                    resolve, reject
                })
            }
            try {
                const message: JsonRpcRequest<{}> = {
                    jsonrpc: '2.0',
                    id,
                    method,
                    // TODO: Only support call with array here (not call where you put the names of params in)
                    params: params
                }
                this._send(message)
                if (typeof id === 'undefined') {
                    // If we don't have an id, we resolve as done immedidately...
                    resolve()
                }
            } catch (e) {
                this._dispatches.delete(id)
                reject(e)
            }
        })
    }

    private _send(message: JsonRpcMessage) {
       this.targetWindow.postMessage(message, this.targetWindowOrigin)
    }

}