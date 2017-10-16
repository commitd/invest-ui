// http://codegists.com/snippet/typescript/jsonrpc2ts_rickcarlino_typescript

/** A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0". */
export type JsonRpcVersion = '2.0'

/** Method names that begin with the word rpc followed by a period character 
 * (U+002E or ASCII 46) are reserved for rpc-internal methods and extensions
 * and MUST NOT be used for anything else.
 */
export type JsonRpcReservedMethod = string

export type JsonRpcMethod = string

/** An identifier established by the Client.
 * 
 * MUST contain a String, Number,
 * or NULL value if included. If it is not included it is assumed to be a 
 * notification. The value SHOULD normally not be Null and Numbers SHOULD
 * NOT contain fractional parts [2].
 */
export type JsonRpcId = number | string | void

export type JsonRpcParameter = never | {}
export type JsonRpcParameters = JsonRpcParameter | JsonRpcParameter[]
export type JsonRpcResult = never | {} | {}[]

export interface JsonRpcNotification<T extends JsonRpcParameters> extends JsonRpcResponse {
    jsonrpc: JsonRpcVersion
    method: JsonRpcMethod,
    params?: T
}

export interface JsonRpcRequest<T extends JsonRpcParameters> extends JsonRpcNotification<T> {
    id: JsonRpcId
}

export interface JsonRpcResponse {
      jsonrpc: JsonRpcVersion
      id: JsonRpcId
}

export interface JsonRpcSuccess<T extends JsonRpcResult> extends JsonRpcResponse {
        result?: T
}

export interface JsonRpcFailure<T extends JsonRpcResult> extends JsonRpcResponse {
        error: JsonRpcError<T>
}

export interface JsonRpcError<T extends JsonRpcResult> {
      /** Must be an integer */
      code: number
      message: string
      data?: T
}

export type JsonRpcMessage = JsonRpcSuccess<{}> | JsonRpcFailure<{}> | JsonRpcRequest<{}> | JsonRpcNotification<{}>

//
// PRE-DEFINED ERROR CODES
//
//
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