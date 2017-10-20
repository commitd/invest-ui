import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

/////// TODO: Move to library
import { Connection } from 'vessel-rpc'
import { createApolloRpcClient } from 'vessel-graphql'
import { ApolloProvider, ApolloClient } from 'react-apollo'

function inIframe() {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}
const isInIFrame = inIframe()

let client: ApolloClient
if (!isInIFrame) {
  console.log('Running standalone')
  client = new ApolloClient()
} else {
  console.log('Running inside vessel')
  const handler = {
    'ping': () => Promise.resolve('pong'),
    'pong': () => console.log('Recieved pong')
  }
  const connection = new Connection(window, window.parent, handler)
  connection.start()
  client = createApolloRpcClient({
    connection: connection
  })
}
/////// END OF TODO: Move to library (maybe have a VesselUi here admittedly which include ApolloProvider below)

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
