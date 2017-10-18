import * as React from 'react'
import Helmet from 'react-helmet'
import { ApolloClient } from 'react-apollo'

import { UiPlugin } from 'vessel-types'
import { Layout, NavBar } from 'vessel-ui-components'

import { PluginListSidebar, GlobalHandler, newGlobalHandler, PluginViewManager, FallbackView } from 'vessel-ui-app'

import { } from './GlobalHandler'

interface Props {
  client: ApolloClient
}

interface State {
  plugins: UiPlugin[],
  selectedPlugin?: UiPlugin,
  open: boolean,
}

// TODO The iframe stakes a http://localhost:8080 which is ok, but what ist ehv alue of it
// window.location.hostname? That doesn;t work in dev mode with webpack . It might have to come from the server / config? And if null then fallback
const baseServerPath = 'http://localhost:8080'

class App extends React.Component<Props, State> {

  globalHandler: GlobalHandler

  state: State = {
    plugins: [{
      id: 'hello',
      name: 'helloword',
      description: 'hello world',
      url: baseServerPath + '/ui/HelloUiPlugin/index.html',
      icon: 'add-circle'
    }, {
      id: 'graphiql',
      name: 'GraphiQL',
      description: 'GraphQL Browser',
      url: baseServerPath + '/ui/graphiql/index.html',
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

  constructor(props: Props) {
    super(props)
    this.globalHandler = newGlobalHandler(props.client)
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

  render() {
    const { plugins, selectedPlugin } = this.state
    const title = 'Vessel'
    const navBar = <NavBar title={title} onSideBarToggle={this.handleDrawerToggle} />
    const sideBar = (
      <PluginListSidebar
        selectedPlugin={selectedPlugin}
        plugins={plugins}
        onPluginSelected={this.handlePluginSelected}
      />
    )

    return (
      <div>
        <Helmet title={title} />
        <Layout navBar={navBar} sideBar={sideBar} open={this.state.open}>
          <PluginViewManager
            globalHandler={this.globalHandler}
            plugin={selectedPlugin}
            plugins={plugins}
            fallback={<FallbackView plugins={plugins} onSelectPlugin={this.handlePluginSelected} />}
          />
        </Layout>
      </div >
    )
  }
}

export default App
