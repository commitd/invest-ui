import { rootLogger } from './index'

test('Root Logger non-null', () => {
    expect(rootLogger).toBeDefined()
})