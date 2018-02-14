import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { InvestUiPlugin } from 'invest-plugin'
import { PluginLifecycle } from 'invest-common'
import { Handler } from 'invest-rpc'

const handler: Handler<PluginLifecycle> = {
  onLoad: () => {
    console.log('Loaded')
  },
  onUnload: () => {
    console.log('Unloaded')
  },
  onAction: (action: string, payload?: {}) => {
    console.log('Recieved action:' + action)
    console.log(payload)

    // Typically you'll actually want to respond to this for example
    // navigating to the a new URL:
    // /view/{payload.documentId}
    // Or updating the state in a (redux like ) store
  },
  onShow: () => {
    console.log('Shown')
  },
  onHide: () => {
    console.log('Hide')
  },
}

ReactDOM.render(
  <InvestUiPlugin handler={handler}>
    <App />
  </InvestUiPlugin>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
