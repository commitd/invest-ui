import { ApplicationClient } from 'invest-framework'
import { Provider } from 'mobx-react'
import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import * as ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import 'semantic-ui-offline/semantic.min.css'
import App from './App'
import { createGraphQLResolver } from './graphql/Resolver'
import history from './history'
import './index.css'
import AuthStore from './stores/AuthStore'
import ConfigurationStore from './stores/ConfigurationStore'
import InvestUiResolverStore from './stores/InvestUiResolverStore'
import UiPluginStore from './stores/UiPluginStore'

const authStore = new AuthStore()
const uiPluginStore = new UiPluginStore()
const configurationStore = new ConfigurationStore()
const investUiResolverStore = new InvestUiResolverStore(authStore, uiPluginStore)

const graphQlResolver = createGraphQLResolver(investUiResolverStore)

const sessionProvider = () => {
  return authStore.authenticated ? authStore.session : undefined
}

const applicationClient = new ApplicationClient('/graphql', graphQlResolver, sessionProvider)

applicationClient.setup().then(() => {
  ReactDOM.render(
    <ApolloProvider client={applicationClient.getApolloClient()}>
      <Provider authStore={authStore} configurationStore={configurationStore} uiPluginStore={uiPluginStore}>
        <Router history={history}>
          <App globalHandler={applicationClient.getGlobalHandler()} />
        </Router>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root') as HTMLElement
  )
})
