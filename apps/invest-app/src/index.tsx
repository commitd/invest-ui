import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import './index.css'
import 'semantic-ui-offline/semantic.min.css'

import App from './App'

import { newStore } from 'invest-redux'
import { Store, Dispatch, combineReducers } from 'redux'
import { rootReducer, RootState } from './redux/RootReducer'
import { rootSaga } from './redux/RootSaga'

import { ApolloProvider } from 'react-apollo'
import { ApplicationClient } from 'invest-framework'
import { createGraphQLResolver } from './graphql/Resolver'

import history from './history'
let store: Store<RootState>

const storeDispatcher: Dispatch<{}> = (a) => store.dispatch(a)

const graphQlResolver = createGraphQLResolver(storeDispatcher, history)

const sessionProvider = () => {
  const auth = store.getState().auth
  return auth.authenticated ? auth.session : undefined
}

store = newStore<RootState>(
  combineReducers({ ...rootReducer }),
  rootSaga)

const applicationClient = new ApplicationClient('/graphql', graphQlResolver, sessionProvider)

applicationClient.setup().then(() => {
  ReactDOM.render(
    <ApolloProvider client={applicationClient.getApolloClient()} >
      <Provider store={store}>
        <Router history={history} >
          <App globalHandler={applicationClient.getGlobalHandler()} />
        </Router>
      </Provider>
    </ApolloProvider>
    ,
    document.getElementById('root') as HTMLElement
  )
})
