import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'semantic-ui-offline/semantic.min.css'

import App from './App'
import './index.css'

import { InvestUiPlugin } from 'invest-plugin'

ReactDOM.render(
  <InvestUiPlugin>
    <App />
  </InvestUiPlugin>,
  document.getElementById('root') as HTMLElement
)