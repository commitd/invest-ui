// import initStoryshots from '@storybook/addon-storyshots'

type GlobalWithAnimationFrame = NodeJS.Global & {
    requestAnimationFrame: (callback: () => {}) => void
}

const polyfilledGlobal = global as GlobalWithAnimationFrame
if (!polyfilledGlobal.requestAnimationFrame) {
    polyfilledGlobal.requestAnimationFrame = (callback: () => {}) => setTimeout(callback, 0)
}

// TODO
// initStoryshots()
test('Storybook disabled due to STORYBOOK_ENV error', () => {
    console.log('Storybooks disabled')
})