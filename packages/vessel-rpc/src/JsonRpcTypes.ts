// Based on http://codegists.com/snippet/typescript/jsonrpc2ts_rickcarlino_typescript

/** A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0". */
export type JsonRpcVersion = '2.0'

/** Method names that begin with the word rpc followed by a period character 
 * (U+002E or ASCII 46) are reserved.
 */
export type JsonRpcReservedMethod = string

/** Name of a JSON RPC Method */
export type JsonRpcMethod = string

/** JSON RPC message id */
export type JsonRpcId = number | string | void

/** JSON RPC method argument  */
export type JsonRpcParameter = undefined | {}
/** JSON RPC method arguments  */
export type JsonRpcParameters = JsonRpcParameter | JsonRpcParameter[]
/** JSON RPC method return  */
export type JsonRpcResult = never | {} | {}[]

/** A JSON RPC notification (one way method call), not response expected */
export interface JsonRpcNotification<T extends JsonRpcParameters> extends JsonRpcResponse {
    /** JSON RPC version = 2.0 */
    jsonrpc: JsonRpcVersion
    /** The method to call */
    method: JsonRpcMethod,
    /** The parameters to call with */
    params?: T
}

/** A JSON RPC method call */
export interface JsonRpcRequest<T extends JsonRpcParameters> extends JsonRpcNotification<T> {
    /** The request id. Should be non-null in order to type the response back to this call */
    id: JsonRpcId
}

/** Base for JSON RPC messages */
export interface JsonRpcResponse {
    /** JSON RPC version number = 2.0 */
    jsonrpc: JsonRpcVersion
    /** The id of the message, optional  */
    id: JsonRpcId
}

/** Successful RPC response, holding the returned result */
export interface JsonRpcSuccess<T extends JsonRpcResult> extends JsonRpcResponse {
    /** The result */
    result?: T
}

/** Failure message */
export interface JsonRpcFailure<T extends JsonRpcResult> extends JsonRpcResponse {
    /** The error */
    error: JsonRpcError<T>
}

/** A JSON RPC Error */
export interface JsonRpcError<T extends JsonRpcResult> {
    /** Must be an integer, see JsonRpcErrorCode */
    code: number
    /** Error message */
    message: string
    /** any other data  */
    data?: T
}

/** A JSON RPC Message */
export type JsonRpcMessage = JsonRpcSuccess<{}> | JsonRpcFailure<{}> | JsonRpcRequest<{}> | JsonRpcNotification<{}>

/** Predefined Json RPC 2.0 Error codes as per the specification */
export enum JsonRpcErrorCode {
    /** An error occurred on the server while parsing the JSON text. */
    PARSE_ERROR = -32700,
    /** The JSON sent is not a valid Request object. */
    INVALID_REQUEST = -32600,
    /** The method does not exist / is not available. */
    METHOD_NOT_FOUND = -32601,
    /** Invalid method parameter(s). */
    INVALID_PARAMS = -32602,
    /** Internal JSON-RPC error. */
    INTERNAL_ERROR = -32603
}