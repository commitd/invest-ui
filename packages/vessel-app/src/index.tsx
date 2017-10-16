import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import App from './App'

import store from './redux/Store'

ReactDOM.render(
  <Provider store={store}>
  < Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
