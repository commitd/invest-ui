import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { Connection } from 'vessel-rpc'
import { createApolloRpcClient } from 'vessel-graphql'

import { ApolloProvider, ApolloClient } from 'react-apollo'

function inIframe () {
  try {
      return window.self !== window.top
  } catch (e) {
      return true
  }
}
const isInIFrame = inIframe()
console.log(isInIFrame)

let client: ApolloClient
if (!isInIFrame) {
  client = new ApolloClient()
} else {
  // TODO: Check if we are in a vessel iframe somehow? Or perhaps we don't care?
  const handler = {
    'ping':  () => Promise.resolve('pong'),
    'pong':  () => console.log('Recieved pong')
  }
  const connection = new Connection(window, window.parent, handler)
  client = createApolloRpcClient({
      connection:  connection
    })
}

ReactDOM.render (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
