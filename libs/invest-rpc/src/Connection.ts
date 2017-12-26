const uniqueId = require('uniqueid')
import * as shortid from 'shortid'
import { loggerFactory } from 'invest-utils'

import {
    JsonRpcId, JsonRpcRequest, JsonRpcMethod, JsonRpcParameter,
    JsonRpcResult, JsonRpcNotification,
    JsonRpcErrorCode,
    JsonRpcMessage, JsonRpcSuccess, JsonRpcFailure
} from './JsonRpcTypes'

import { Handler, UnfulfilledPromise } from './types'
import { clearTimeout, setInterval } from 'timers'

const logger = loggerFactory.getLogger('Connection')
logger.setLevel('info')

/** This is a partial implementation of Window, to reduce mock/test surface */
export type SourceWindow = EventTarget & {
    location: {
        origin: string
    }
}

/** This is a partial implementation of Window, to reduce mock/test surface */
export type TargetWindow = {} & {
    location: {
        origin: string
    },
    postMessage(message: {}, targetOrigin: string, transfer?: {}[] | undefined): void
}

/**
 * A JSON-RPC 2.0 client that sends requests and notifications over `window.postMessage`.
 * 
 * NOte this does not implement batching.
 */
export default class Connection<S> {

    private sourceWindow: SourceWindow
    private targetWindow: TargetWindow
    private targetWindowOrigin: string
    private handler: Handler<S>
    private disableWindowChecking: boolean
    private pingTimer?: NodeJS.Timer
    private signalReady: () => void
    private readyPromise: Promise<Boolean>
    private ready: boolean = false

    private _instanceId: String = shortid()
    private uniqueIdGenerator = uniqueId(this._instanceId + '_')
    private _dispatches = new Map<JsonRpcId, UnfulfilledPromise>()

    /** Create a new connect between the sourceWindow (us) and a targetWindow
     * 
     * @param sourceWindow our window
     * @param targetWindow the window to send and receive from
     * @param handler the handler which will deal with any incoming requests from the target
     * @param disableWindowChecking set to true if you don't want to check the origin/destination of messages. 
     * This will mean the handler will process messages which are not from the target window or meant for the
     * this window. However it's useful for testing to avoid excessive mocking of Window.
     */
    constructor(
        sourceWindow: SourceWindow,
        targetWindow: TargetWindow,
        handler: Handler<S>,
        disableWindowChecking: boolean = false) {
        this.targetWindow = targetWindow
        this.sourceWindow = sourceWindow
        this.handler = handler
        this.disableWindowChecking = disableWindowChecking
        this.readyPromise = new Promise((resolve, reject) => {
            this.signalReady = () => {
                this.stopPinging()
                this.ready = true
                resolve()
            }
        })

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

    /** Start listening for events  */
    start() {
        this.sourceWindow.addEventListener('message', this.handleMessage)
        this.sourceWindow.addEventListener('onunload', this.stop)

        this.startPinging()
    }

    /** Stop listening for events.  */
    stop() {
        this.stopPinging()

        this.sourceWindow.removeEventListener('message', this.handleMessage)
        this.sourceWindow.removeEventListener('onunload', this.stop)
    }

    isReady(): boolean {
        return this.ready
    }

    /**
     * Call via RPC the method with the arguments as is, return a promise will be resolve when the message is *sent*
     * @param method the method to call
     * @param params the arguments to call the method with
     */
    notify(method: JsonRpcMethod, ...params: JsonRpcParameter[]): Promise<void> {
        return this._dispatch<void>(method, undefined, ...params)
    }

    /**
     * Call via RPC the method with the arguments as is, returning a promise with the result
     * @param method the method to call
     * @param params the arguments to call the method with
     */
    request<T>(method: JsonRpcMethod, ...params: JsonRpcParameter[]): Promise<T> {
        return this._dispatch(method, this.uniqueIdGenerator(), ...params)
    }

    /**
     * Verify a message is for us, and then pass it to the handler.
     * 
     * Note this is only public for testing purposes.
     * 
     * @param e the event to handle
     * 
     */
    handleMessage = (e: MessageEvent) => {
        try {
            this.actuallyHandleMessage(e)
        } catch (e) {
            logger.error('Unable to handleMessage', e)
        }
    }

    private actuallyHandleMessage(e: MessageEvent) {

        // Is JSONRPC?
        if (!e.data || !e.data.jsonrpc) {
            return
        }

        // If it for us, and from our child window?
        if (!this.disableWindowChecking
            && !(e.target === this.sourceWindow
                && (<{}>e.source) === (<{}>this.targetWindow)
            )) {
            return
        }

        const message = e.data as JsonRpcMessage
        logger.trace('Connection.handleMessage', message)

        // If a request or notification we need to pass to handler
        // if a response or error then we need to deal with, if we have an id for that

        if ((<JsonRpcNotification<{}>>message).method) {
            this._handleRequestOrNotification(<JsonRpcNotification<{}> | JsonRpcRequest<{}>>message)
        } else {
            this._handleResponse(<JsonRpcSuccess<{}> | JsonRpcFailure<{}>>message)
        }

    }

    /**
     * Handle a incoming message which should be a response to one of our request
     * @param response 
     */
    private _handleResponse(response: JsonRpcSuccess<{}> | JsonRpcFailure<{}>) {
        logger.trace('Connection._handleResponse', response)

        // Is this a response to our message? 

        const dispatch = this._dispatches.get(response.id)
        this._dispatches.delete(response.id)
        if (dispatch && dispatch.resolve && dispatch.reject) {
            if ((<JsonRpcFailure<{}>>response).error) {
                dispatch.reject((<JsonRpcFailure<{}>>response).error)
            } else {
                dispatch.resolve((<JsonRpcSuccess<{}>>response).result)
            }
        } else {
            logger.warn('Discarding response, as no matching request', response)
        }
    }

    /**
     * Handle a incoming message which is either a request or a notification.
     * @param message the message payload
     */
    private _handleRequestOrNotification(message: JsonRpcRequest<{}> | JsonRpcNotification<{}>) {

        // Handle ping/pong handshake ourselves
        if (message.method === 'ping') {
            this.sendPong()
            return
        } else if (message.method === 'pong') {
            this.signalReady()
            logger.info('Connection: Ready')
            return
        }

        if (this.handler.hasOwnProperty(message.method)) {
            let p: Promise<{}>
            if (message.params === undefined) {
                p = this.handler[message.method]()
            } else if (message.params instanceof Array) {
                p = this.handler[message.method](...message.params)
            } else {
                p = this.handler[message.method](message.params)
            }

            // If p is null ( you called a void function), then we resolve it empty and hope that's ok!
            if (p == null) {
                p = Promise.resolve({})
            }

            // If this is a request, we need to send the result back
            if ((<JsonRpcRequest<{}>>message).id) {
                const id = (<JsonRpcRequest<{}>>message).id
                p.then(
                    value => this._replyWithSuccess(id, value),
                    reason => {
                        // TODO: Log this error
                        this._replyWithError(id, JsonRpcErrorCode.INTERNAL_ERROR, 'Handling error', reason)
                    }
                )
            }
        } else {
            // TODO: Log this error lcoally?
            if ((<JsonRpcRequest<{}>>message).id) {
                const id = (<JsonRpcRequest<{}>>message).id
                this._replyWithError(
                    id,
                    JsonRpcErrorCode.INTERNAL_ERROR,
                    'Cant find method: ' + message.method,
                    undefined)
            }
        }
    }

    /**
     * Reply via RPC with a succesful return 
     * @param id the original message id
     * @param data the data to return
     */
    private _replyWithSuccess(id: JsonRpcId, data: JsonRpcResult) {
        const message: JsonRpcSuccess<{}> = {
            jsonrpc: '2.0',
            id,
            result: data
        }
        this._send(message)
    }

    /**
     * Reply to the RPC caller with an error
     * @param id the original message id
     * @param code the error code
     * @param message the error message
     * @param data any error payload
     */
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

    /**
     * Call the RPC method
     * @param method the method to call
     * @param id the id of the message. If no id is set then this is a notification (resolved immediately in effect), 
     * else a request to be resolved on return RPC message.
     * @param params the arguments to call the method with
     */
    private _dispatch<T>(method: JsonRpcMethod, id: JsonRpcId, ...params: JsonRpcParameter[]): Promise<T> {
        // If we are already ready then great, immediately send
        if (this.isReady()) {
            return this._actuallyDispatch(method, id, params)
        } else {
            // Otherwise wait for the readyPromise to be resolved and then send
            return this.readyPromise
                .then((): Promise<T> => this._actuallyDispatch(method, id, params))
        }
    }

    private _actuallyDispatch<T>(method: JsonRpcMethod, id: JsonRpcId, params: JsonRpcParameter[]): Promise<T> {
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
                logger.error('Unable to send', e)
                reject(e)
            }
        })
    }

    /**
     * Send a message to the target window
     * @param message the message
     */
    private _send(message: JsonRpcMessage) {
        logger.trace('Connection._send', message)
        this.targetWindow.postMessage(message, this.targetWindowOrigin)
    }

    private startPinging() {
        if (this.pingTimer == null) {
            this.pingTimer = setInterval(this.sendPing, 100)
        }
    }

    private stopPinging() {
        if (this.pingTimer != null) {
            clearTimeout(this.pingTimer)
            this.pingTimer = undefined
        }
    }

    private sendPing = () => {
        this._send({
            id: 'ping',
            jsonrpc: '2.0',
            method: 'ping'
        })
    }

    private sendPong() {
        this._send({
            id: 'pong',
            jsonrpc: '2.0',
            method: 'pong'
        })
    }
}