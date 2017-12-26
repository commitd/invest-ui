import { isJsonRpcId } from './utils'

describe('isJsonRpcId', () => {

    it('is false for empty messages', () => {
        expect(isJsonRpcId({})).toBe(false)
    })

    it('is true for strings', () => {
        expect(isJsonRpcId('abc')).toBe(true)
    })

    it('is true for int numbers', () => {
        expect(isJsonRpcId(123)).toBe(true)
    })

    it('is false for real numbers', () => {
        expect(isJsonRpcId(123.1)).toBe(false)
    })

    it('is false for arays', () => {
        expect(isJsonRpcId([123])).toBe(false)
    })
})