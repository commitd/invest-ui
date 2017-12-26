import { mergeHandler } from './HandlerUtils'
import { Handler } from 'invest-rpc'
interface A {
    fromA(): string
}

interface B {
    fromB(): string
}

describe('HandlerUtils', () => {

    it('merges two independent handlers', () => {
        const a: Handler<A> = {
            'fromA': () => 'A'
        }
        const b: Handler<B> = {
            'fromB': () => 'B'
        }

        const c = mergeHandler(a, b)

        expect(c.fromA()).toBe('A')
        expect(c.fromB()).toBe('B')
    })

    it('merges two handlers will common functions', () => {
        const a: Handler<A> = {
            'fromA': () => 'A'
        }
        const b: Handler<A> = {
            'fromA': () => 'B'
        }

        const c = mergeHandler(a, b)

        expect(c.fromA()).toBe('B')
    })
})