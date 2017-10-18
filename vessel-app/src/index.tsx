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

import { MaterialUi } from 'vessel-ui-components'
import { ApolloProvider, ApolloClient } from 'react-apollo'
const client = new ApolloClient()

ReactDOM.render(
  <ApolloProvider client={client} >
    <MaterialUi>
      <Provider store={store}>
        <Router>
          <App client={client}  />
        </Router>
      </Provider>
    </MaterialUi>
  </ApolloProvider>
,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
