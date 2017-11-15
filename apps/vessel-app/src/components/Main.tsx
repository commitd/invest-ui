import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql, gql, ChildProps } from 'react-apollo'
import { Route, withRouter, matchPath, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'
import { PluginListSidebar, GlobalHandler, PluginViewManager, FallbackView } from 'vessel-framework'
import { UiPlugin, PluginWithIntent } from 'vessel-types'
import { Layout, NavBar, Login } from 'vessel-components'
import { searchToIntent } from 'vessel-utils'
import AuthMenu from './AuthMenu'
import * as RootAction from '../redux/RootAction'

interface GqlResponse {
  vesselServer: {
    uiPlugins: UiPlugin[]
  }
}

interface OwnProps {
  globalHandler: GlobalHandler
}

interface ConnectProps {
  updatePlugins(plugins: UiPlugin[]): {}
}

type Props = ChildProps<OwnProps, GqlResponse> & RouteComponentProps<{}> & ConnectProps

interface State {
  sidebarOpen: boolean,
}

// Note that we use the URL to decide on the plugin and we do it internally here. 
// We don't rely on the Route from 
class Main extends React.Component<Props, State> {

  state: State = {
    sidebarOpen: true
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

  getPlugins(): UiPlugin[] {
    return this.props.data && this.props.data.vesselServer ? this.props.data.vesselServer.uiPlugins : []
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data && !nextProps.data.loading) {
      const data = nextProps.data
      if (data.vesselServer && data.vesselServer.uiPlugins) {
        this.props.updatePlugins(data.vesselServer.uiPlugins)
      }
    }
  }

  render() {
    let plugins = this.getPlugins()
    const title = 'Vessel'

    const selectedPlugin = this.findSelectedPlugin()

    const plugin: PluginWithIntent | undefined = selectedPlugin ? {
      plugin: selectedPlugin,
      intent: searchToIntent(this.props.location.search)
    } : undefined

    const rightMenu = <AuthMenu />
    const navBar = <NavBar title={title} onSideBarToggle={this.handleDrawerToggle} rightArea={rightMenu} />
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
        <Route path="/auth/login" component={Login} />
        <Layout navBar={navBar} sideBar={sideBar} open={this.state.sidebarOpen}>
          <PluginViewManager
            globalHandler={this.props.globalHandler}
            plugin={plugin}
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
        actions {
          action
          title
          description
        }
      }
    }
  }
`

const mapDispatchtoProps = (
  dispatch: Dispatch<{}>) => ({
    updatePlugins: (plugins: UiPlugin[]) => dispatch(RootAction.actionCreators.plugins.setPlugins({
      uiPlugins: plugins
    }))
  })

const connected = connect<ChildProps<OwnProps, GqlResponse> & RouteComponentProps<{}>>
  (undefined, mapDispatchtoProps)(Main)
export default withRouter(graphql<Response, OwnProps, Props>(APP_QUERY)(connected))