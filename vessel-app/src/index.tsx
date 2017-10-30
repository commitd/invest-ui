import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import App from './App'

import { newStore } from 'vessel-redux'
import { Store, Dispatch, combineReducers } from 'redux'
import { rootReducer, RootState } from './redux/RootReducer'
import { rootSaga } from './redux/RootSaga'

// TODO; These sshould be in vessel-ui-componnts MaterialUi but that's a simple library (not webpacked)
import './icons/index'

import { MaterialUi } from 'vessel-components'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import { MiddlewareRequest } from 'apollo-client/transport/middleware'
import { vesselUiRoot, schema } from 'vessel-framework'
import { SpiltNetworkInterface, LocalNetworkInterface } from 'vessel-graphql'
import { createGraphQLResolver } from './graphql/Resolver'

import history from './history'
let store: Store<RootState>

const storeDispatcher: Dispatch<{}> = (a) => store.dispatch(a)

const graphQlResolver = createGraphQLResolver(storeDispatcher, history)

const httpNetworkInterface = createNetworkInterface({
  uri: '/graphql'
})

const client = new ApolloClient({
  networkInterface: new SpiltNetworkInterface({
    interfaces: {
      [vesselUiRoot]: new LocalNetworkInterface(schema, graphQlResolver)
    },
    defaultInterface: httpNetworkInterface
  })
})

store = newStore<RootState>(
  combineReducers({ ...rootReducer, apollo: client.reducer() }),
  rootSaga,
  [client.middleware()])

// Use the session from the store...

httpNetworkInterface.use([{
  applyMiddleware(req: MiddlewareRequest, next: Function) {
    if (!req.options.headers) {
      req.options.headers = {}  // Create the header object if needed.
    }

    const auth = store.getState().auth
    req.options.headers.SESSION = auth.authenticated ? auth.session : null
    next()
  }
}])

ReactDOM.render(
  <ApolloProvider store={store} client={client} >
    <MaterialUi>
      <Provider store={store}>
        <Router history={history} >
          <App />
        </Router>
      </Provider>
    </MaterialUi>
  </ApolloProvider>
  ,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
