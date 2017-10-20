import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { VesselUiPlugin } from 'vessel-plugin'

const handler = {
  onLoad: () => {
    console.log('Loaded')
    return Promise.resolve('ok')
  },
  onUnload: () => {
    console.log('Unloaded')
    return Promise.resolve('ok')
  },
  onShow: () => {
    console.log('Shown')
    return Promise.resolve('ok')
  },
  onHide: () => {
    console.log('Hide')
    return Promise.resolve('ok')
  },
}

ReactDOM.render(
  <VesselUiPlugin handler={handler}>
    <App />
  </VesselUiPlugin>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
