
import { JsonRpcId } from './JsonRpcTypes'

/** Determine if data is a properly formatted JSONRPC 2.0 ID. */
export function isJsonRpcId(input: JsonRpcId|{}): input is JsonRpcId {
        switch (typeof input) {
            case 'string':
              return (input as string).length > 0
            case 'number':
              return (input as number) % 1 !== 0
            case 'object':
              if (input === null) {
                  console.warn('Use of null ID in JSONRPC 2.0 is discouraged.')
                  return true
              } else {
                  return false
              }
            default:
              return false
        }
    }