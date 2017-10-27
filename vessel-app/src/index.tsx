import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import App from './App'

import { newStore } from 'vessel-redux'
import { rootReducer, RootState } from './redux/RootReducer'
import { rootSaga } from './redux/RootSaga'

// TODO; These sshould be in vessel-ui-componnts MaterialUi but that's a simple library (not webpacked)
import './icons/index'

import { MaterialUi } from 'vessel-components'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'

import { vesselUiRoot, schema } from 'vessel-framework'
import { SpiltNetworkInterface, LocalNetworkInterface } from 'vessel-graphql'
import { createGraphQLResolver } from './graphql/Resolver'

const history = createBrowserHistory()
const store = newStore<RootState>(rootReducer, rootSaga)

const graphQlResolver = createGraphQLResolver(store, history)

const client = new ApolloClient({
  networkInterface: new SpiltNetworkInterface({
    interfaces: {
      [vesselUiRoot]: new LocalNetworkInterface(schema, graphQlResolver)
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
        <Router history={history} >
          <App client={client} />
        </Router>
      </Provider>
    </MaterialUi>
  </ApolloProvider>
  ,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
