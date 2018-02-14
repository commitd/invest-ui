import { newStore } from './store'

describe('store', () => {
    const reducer = jest.fn()

    it('creates a non-null store', () => {
        const store = newStore(reducer, undefined)

        // Initial state updates once...
        expect(reducer.mock.calls.length).toBe(1)

        store.dispatch({ type: 'test' })

        expect(reducer.mock.calls.length).toBe(2)

    })
})