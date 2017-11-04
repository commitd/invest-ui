import { dispatchAsAction, createResolverAction, resolverMeta } from './resolvers'
import { ResolverAction, PromiseCompletion } from './types'

interface ExamplePayload {
    example: string
}

interface ExampleResult {
    result: boolean
}

describe('dispatchAsAction', () => {

    const testPayload = { example: 'payload' }
    const creator = (payload: {}, meta: PromiseCompletion<Response>) => ({
        type: 'test',
        payload: payload,
        meta: {
            promise: meta
        }
    })
    const dispatch = jest.fn()

    beforeEach(() => {
        dispatch.mockReset()
    })

    it('dispatches', () => {
        const p = dispatchAsAction(dispatch, creator, testPayload)

        expect(p).toBeDefined()
        expect(dispatch).toBeCalled()

        // Check the promise looks valid
        const arg = dispatch.mock.calls[0][0] as ResolverAction<ExamplePayload, ExampleResult>
        expect(arg.type).toBe('test')
        expect(arg.payload).toBe(testPayload)
        expect(arg.meta.promise.resolve).toBeDefined()
        expect(arg.meta.promise.reject).toBeDefined()
    })

    it('resolves the promise', () => {
        const p = dispatchAsAction(dispatch, creator, testPayload)
        const arg = dispatch.mock.calls[0][0] as ResolverAction<ExamplePayload, ExampleResult>
        const resolve = arg.meta.promise.resolve

        resolve({ result: true })
        expect(p).resolves.toEqual({ result: true })

    })

    it('reject the promise', () => {
        const p = dispatchAsAction(dispatch, creator, testPayload)

        const arg = dispatch.mock.calls[0][0] as ResolverAction<ExamplePayload, ExampleResult>
        const reject = arg.meta.promise.reject

        reject('error')
        expect(p).rejects.toBe('error')
    })
})

describe('createResolverAction', () => {
    it('creates an action creator', () => {
        const creator = createResolverAction('test')
        expect(creator).toBeDefined()
        const testPayload = { example: 'payload' }
        const resolve = jest.fn()
        const reject = jest.fn()

        const action = creator(testPayload, { resolve, reject })

        expect(action.type).toBe('test')
        expect(action.payload).toBe(testPayload)

        action.meta.promise.reject('any')
        expect(reject).toBeCalledWith('any')
        expect(resolve).not.toBeCalled()
        reject.mockReset()

        action.meta.promise.resolve('any')
        expect(resolve).toBeCalledWith('any')
        expect(reject).not.toBeCalled()

    })
})

describe('resolverMeta', () => {
    it('returns provided promise', () => {
        const meta = {
            resolve: jest.fn(),
            reject: jest.fn()
        }
        const r = resolverMeta({}, meta)

        // Rather than expecting it to be the same, we just want our resolve and reject to be called
        r.promise.reject('any')
        expect(meta.reject).toBeCalledWith('any')
        expect(meta.resolve).not.toBeCalled()
        meta.reject.mockReset()

        r.promise.resolve('any')
        expect(meta.resolve).toBeCalledWith('any')
        expect(meta.reject).not.toBeCalled()
    })
})