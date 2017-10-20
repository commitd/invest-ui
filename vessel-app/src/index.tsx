import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import App from './App'

import { newStore } from 'vessel-redux'
import { rootReducer, RootState } from './redux/RootReducer'
import { rootSaga } from './redux/RootSaga'
const store = newStore<RootState>(rootReducer, rootSaga)

// TODO; These sshould be in vessel-ui-componnts MaterialUi but 
import './icons/index'

import { MaterialUi } from 'vessel-components'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'

import { vesselUiRoot, schema, VesselUiGraphQLRoot } from 'vessel-framework'
import { SpiltNetworkInterface, LocalNetworkInterface } from 'vessel-graphql'

const simpleRoot: VesselUiGraphQLRoot = {
  vesselUi: {
    status: () => 'ok'
  }
}

const client = new ApolloClient({
  networkInterface: new SpiltNetworkInterface({
    interfaces: {
      [vesselUiRoot]: new LocalNetworkInterface(schema, simpleRoot)
      // TODO: Likely have something like this
      // 'vesselServer': createNetworkInterface({
      //   uri: '/vessel/graphql'
      // }),
    },
    defaultInterface: createNetworkInterface({
      uri: '/graphql'
    })
  })
})

ReactDOM.render(
  <ApolloProvider client={client} >
    <MaterialUi>
      <Provider store={store}>
        <Router>
          <App client={client} />
        </Router>
      </Provider>
    </MaterialUi>
  </ApolloProvider>
  ,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
