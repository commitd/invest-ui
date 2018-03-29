import { isJsonRpcId } from './utils'

describe('isJsonRpcId', () => {

    test('is false for empty messages', () => {
        expect(isJsonRpcId({})).toBe(false)
    })

    test('is true for strings', () => {
        expect(isJsonRpcId('abc')).toBe(true)
    })

    test('is true for int numbers', () => {
        expect(isJsonRpcId(123)).toBe(true)
    })

    test('is false for real numbers', () => {
        expect(isJsonRpcId(123.1)).toBe(false)
    })

    test('is false for arays', () => {
        expect(isJsonRpcId([123])).toBe(false)
    })
})