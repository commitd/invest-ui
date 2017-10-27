import * as React from 'react'
import Helmet from 'react-helmet'
import { ApolloClient, ChildProps } from 'react-apollo'

import { UiPlugin } from 'vessel-types'
import { Layout, NavBar } from 'vessel-components'

import { PluginListSidebar, GlobalHandler, newGlobalHandler, PluginViewManager, FallbackView } from 'vessel-framework'
import { graphql, gql } from 'react-apollo'

interface GqlResponse {
  vesselServer: {
    uiPlugins: UiPlugin[]
  }
}

interface OwnProps {
  client: ApolloClient
}

type Props = ChildProps<OwnProps, GqlResponse>

interface State {
  selectedPlugin?: UiPlugin,
  open: boolean,
}

class App extends React.Component<Props, State> {

  globalHandler: GlobalHandler

  // Mock data from server:

  // plugins: [{
  //   id: 'hello',
  //   name: 'helloword',
  //   description: 'hello world',
  //   url: '/ui/HelloUiPlugin/index.html',
  //   icon: 'add-circle'
  // }, {
  //   id: 'graphiql',
  //   name: 'GraphiQL',
  //   description: 'GraphQL Browser',
  //   url: '/ui/graphiql/index.html',
  //   icon: 'add-circle'
  // }, {
  //   id: 'dev',
  //   name: 'Development',
  //   description: 'Development plugin',
  //   url: 'http://localhost:3001',
  //   icon: 'add-circle'
  // }, {
  //   id: 'kibana',
  //   name: 'Kibana',
  //   description: 'Kibana for search',
  //   url: 'https://dci.arga.committed.software/',
  //   icon: 'add-circle'
  // }, {
  //   id: 'arga',
  //   name: 'Arga',
  //   description: 'Report writer',
  //   url: 'https://dpi.arga.committed.software/',
  //   icon: 'add-circle'
  // }],

  state: State = {
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
    let plugins = this.props.data && this.props.data.vesselServer ? this.props.data.vesselServer.uiPlugins : []
    const { selectedPlugin } = this.state
    const title = 'Vessel'

    // Hack for development
    plugins = [{
      id: 'dev',
      name: 'Development',
      description: 'Development plugin',
      url: 'http://localhost:3001',
      icon: 'add-circle'
    }].concat(plugins)

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

const APP_QUERY = gql`
  query {
    vesselServer {
      uiPlugins {
        id
        name
        description
        url
        icon
      }
    }
  }
`

export default graphql<Response, OwnProps, Props>(APP_QUERY)(App)
