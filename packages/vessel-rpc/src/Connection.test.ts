import Connection, { SourceWindow, TargetWindow } from './Connection'
import { Handler } from './types'

interface TestState {
    handle(data: {}): string
}

describe('Connection', () => {

    let sourceWindow: SourceWindow
    let sourcePostMessage: jest.Mock<{}>
    let targetWindow: TargetWindow
    let targetPostMessage: jest.Mock<{}>
    let handleCallback: jest.Mock<{}>
    let handler: Handler<TestState>

    beforeEach(() => {
        sourcePostMessage = jest.fn()
        targetPostMessage = jest.fn()
        handleCallback = jest.fn()

        sourceWindow = {
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
            location: {
                origin: 'source'
            }
        }

        targetWindow = {
            postMessage: targetPostMessage
        }

        handler = {
            handle: handleCallback
        }
    })

    it(' sends notifications', () => {
        const c = new Connection(sourceWindow, targetWindow, handler)

        c.start()

        c.notify('handle', {})

        c.stop()

        expect(targetPostMessage.mock.calls.length).toBe(1)
    })

    it(' sends request', () => {
        const c = new Connection(sourceWindow, targetWindow, handler)

        c.start()

        c.request('handle', {})

        c.stop()

        expect(targetPostMessage.mock.calls.length).toBe(1)
    })

    it(' handles message', () => {
        const c = new Connection(sourceWindow, targetWindow, handler, true)

        c.start()

        const m = new MessageEvent('fake', {
            data: {
                jsonrpc: '2.0',
                id: 'result',
                method: 'handle',
                result: {
                    value: 'success'
                }
            }
        })
        c.handleMessage(m)

        c.stop()

        expect(handleCallback.mock.calls.length).toBe(1)
    })

    // NOTE: It would be nice to have more tests here around security, but they are 
    // hard without a full browser environment
    // TODO: Use browser based testing to check sandboxing etc
})