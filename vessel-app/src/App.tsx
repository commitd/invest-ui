import * as React from 'react'
import Helmet from 'react-helmet'
import { ApolloClient, ChildProps } from 'react-apollo'
import { withRouter, matchPath, RouteComponentProps } from 'react-router-dom'

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

type Props = ChildProps<OwnProps, GqlResponse> & RouteComponentProps<{}>

interface State {
  sidebarOpen: boolean,
}

// Note that we use the URL to decide on the plugin and we do it internally here. 
// We don't rely on the Route from 
class App extends React.Component<Props, State> {

  globalHandler: GlobalHandler

  state: State = {
    sidebarOpen: true
  }

  constructor(props: Props) {
    super(props)
    this.globalHandler = newGlobalHandler(props.client)
  }

  handleDrawerClose = () => {
    this.setState({
      sidebarOpen: false
    })
  }

  handleDrawerOpen = () => {
    this.setState({
      sidebarOpen: true
    })
  }

  handleDrawerToggle = () => {
    this.setState((state) => ({
      sidebarOpen: !state.sidebarOpen
    }))
  }

  handlePluginSelected = (p?: UiPlugin) => {
    if (p) {
      this.props.history.push('/view/' + p.id)
    } else {
      this.props.history.push('/')
    }
  }

  findSelectedPlugin() {
    const path =
      matchPath<{ pluginId?: string }>(this.props.history.location.pathname, {
        path: '/view/:pluginId',
        exact: true
      })

    if (path && path.params && path.params.pluginId) {
      return this.getPlugins().find(p => p.id === path.params.pluginId)
    } else {
      return undefined
    }
  }

  getPlugins() {
    let plugins = this.props.data && this.props.data.vesselServer ? this.props.data.vesselServer.uiPlugins : []
    // Hack for development
    return [{
      id: 'dev',
      name: 'Development',
      description: 'Development plugin',
      url: 'http://localhost:3001',
      icon: 'add-circle'
    }].concat(plugins)
  }

  render() {
    let plugins = this.getPlugins()
    const title = 'Vessel'

    const selectedPlugin = this.findSelectedPlugin()

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
        <Layout navBar={navBar} sideBar={sideBar} open={this.state.sidebarOpen}>
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

export default graphql<Response, OwnProps, Props>(APP_QUERY)(withRouter(App))
