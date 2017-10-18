import * as React from 'react'
import Helmet from 'react-helmet'
import { IFrame, Layout, NavBar, PluginListSidebar } from 'vessel-ui-app'
import { UiPlugin } from 'vessel-types'

// TODO: Have a single handler for the minute, but it should probably be one per iframe (and it obviously should be a component )
import { createGraphQLHandlerForClient } from 'vessel-graphql'
import { ApolloProvider, ApolloClient } from 'react-apollo'

const client = new ApolloClient()

const handler = {
  'graphql':  createGraphQLHandlerForClient(client),
}

// END OF TODO

interface Props {
}

interface State {
    plugins: UiPlugin[],
    selectedPlugin?: UiPlugin,
    open: boolean,
}

// TODO The iframe stakes a http://localhost:8080 which is ok, but what ist ehv alue of it
// window.location.hostname? That doesn;t work in dev mode with webpack . It might have to come from the server / config? And if null then fallback

class App extends React.Component<Props, State> {

  state: State = {
    plugins: [{
      id: 'hello',
      name: 'helloword',
      description: 'hello world',
      url: '/ui/HelloUiPlugin/index.html',
      icon: 'add-circle'
    }, {
      id: 'graphiql',
      name: 'GraphiQL',
      description: 'GraphQL Browser',
      url: '/ui/graphiql/index.html',
      icon: 'add-circle'
    }, {
      id: 'dev',
      name: 'Development',
      description: 'Development plugin',
      url: 'http://localhost:3001',
      icon: 'add-circle'
    }],
    selectedPlugin: undefined,
    open: true
  }

  handleDrawerClose = () => {
    this.setState({
      open: false
    })
  }

  handleDrawerOpen = () => {
    this.setState({
      open: true
    })
  }

  handleDrawerToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  handlePluginSelected = (p?: UiPlugin) => {
    this.setState({
      selectedPlugin: p
    })
  }

  absoluteUrlForPlugin(p: UiPlugin) {
    if (p.url.startsWith('http:') || p.url.startsWith('https:')) {
      return p.url
    } else {
      return 'http://localhost:8080' + p.url
    }
  }

  render() {
    const { plugins, selectedPlugin } = this.state
    const title = 'Vessel'
    const navBar = <NavBar title={title}  onSideBarToggle={this.handleDrawerToggle} />
    const sideBar = (
      <PluginListSidebar 
          selectedPlugin={selectedPlugin} 
          plugins={plugins} 
          onPluginSelected={this.handlePluginSelected} 
      />
    )

    return (
      <ApolloProvider client={client}>
      <div>
      <Helmet title={title} />
      <Layout navBar={navBar} sideBar={sideBar} open={this.state.open}>
      {selectedPlugin != null ? 
          // THe key here is important:
          // we want a change in the plugin to result in a new iframe instance - so we have a new Connection etc
          <IFrame key={selectedPlugin.id} src={this.absoluteUrlForPlugin(selectedPlugin)} handler={handler} /> 
         : <p>Select a plugin</p>}
      </Layout>
      </div>
      </ApolloProvider>
    )
  }
}

export default App
