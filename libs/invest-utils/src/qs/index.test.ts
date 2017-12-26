import { searchToIntent, intentToSearch } from './index'
interface TestIntent {
    action: string,
    payload: {
        value: boolean
    }
}

describe('qs intents', () => {
    it('intent to search to intent', () => {
        const intent: TestIntent = {
            action: 'test',
            payload: {
                value: true
            }
        }

        const search = intentToSearch(intent)
        expect(search).toBe('action=test&payload=%7B%22value%22%3Atrue%7D')

        const output = searchToIntent(search)
        expect(output).toEqual(intent)
    })
})