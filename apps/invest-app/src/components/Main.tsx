import * as React from 'react'
import Helmet from 'react-helmet'
import { graphql, ChildProps } from 'react-apollo'
import gql from 'graphql-tag'
import { Route, withRouter, matchPath, RouteComponentProps } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { PluginListSidebar, GlobalHandler, PluginViewManager, FallbackView } from 'invest-framework'
import { UiPlugin, PluginWithIntent, InvestConfiguration } from 'invest-types'
import { Layout, NavBar, Login } from 'invest-components'
import { searchToIntent } from 'invest-utils'

import AuthMenu from './AuthMenu'
import * as RootAction from '../redux/RootAction'
import { RootState } from '../redux/RootReducer'
import { State as AuthState } from '../redux/reducers/auth'
import { canUserSeePlugin } from '../utils/RoleUtils'

interface GqlResponse {
  investServer: {
    configuration: InvestConfiguration
    authentication: {
      enabled: boolean
    }
    uiPlugins: UiPlugin[]
  }
}

interface OwnProps {
  globalHandler: GlobalHandler
}

interface MapStateProps {
  auth: AuthState,
}

interface DispatchProps {
  updatePlugins(plugins: UiPlugin[]): {}
  updateConfiguration(configuration: InvestConfiguration): {}
  setAuthenticationMode(enabled: boolean): {}
}

type Props = ChildProps<OwnProps, GqlResponse> & RouteComponentProps<{}> & MapStateProps & DispatchProps

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
    const allPlugins = this.props.data && this.props.data.investServer ? this.props.data.investServer.uiPlugins : []

    return allPlugins.filter(p => canUserSeePlugin(this.props.auth, p))
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data && !nextProps.data.loading) {
      const data = nextProps.data
      if (data.investServer && data.investServer.uiPlugins) {
        this.props.updatePlugins(data.investServer.uiPlugins)
      }
      if (data.investServer && data.investServer.configuration) {
        this.props.updateConfiguration(data.investServer.configuration)
      }
      if (data.investServer && data.investServer.authentication) {
        this.props.setAuthenticationMode(data.investServer.authentication.enabled)
      }
    }
  }

  render() {

    const serverUrl = this.guessServerUrl(this.props.data
      && this.props.data.investServer && this.props.data.investServer.configuration
      ? this.props.data.investServer.configuration : undefined)

    let plugins = this.getPlugins()
    const title = (this.props.data
      && this.props.data.investServer
      && this.props.data.investServer.configuration.title)
      || 'Invest'
    const authenticationMode = (this.props.data
      && this.props.data.investServer
      && this.props.data.investServer.authentication.enabled)

    const selectedPlugin = this.findSelectedPlugin()

    const plugin: PluginWithIntent | undefined = selectedPlugin ? {
      plugin: selectedPlugin,
      intent: searchToIntent(this.props.location.search)
    } : undefined

    const rightMenu = authenticationMode ? <AuthMenu /> : undefined
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
            serverUrl={serverUrl}
            globalHandler={this.props.globalHandler}
            plugin={plugin}
            plugins={plugins}
            fallback={<FallbackView plugins={plugins} onSelectPlugin={this.handlePluginSelected} />}
          />
        </Layout>
      </div >
    )
  }

  private guessServerUrl(configuration?: InvestConfiguration): string {
    const configurationUrl = configuration && configuration.serverUrl
    if (configurationUrl) {
      return configurationUrl
    }

    return window.location.protocol + '//' + window.location.host
  }
}

const APP_QUERY = gql`
  query {
    investServer {
      configuration {
        title
        serverUrl
        settings
      }
      authentication {
        enabled
      }
      uiPlugins {
        id
        name
        description
        url
        icon
        roles
        actions {
          action
          title
          description
        }
      }
    }
  }
`

const mapStateToProps = (state: RootState) => ({
  auth: state.auth
})

const mapDispatchToProps = (
  dispatch: Dispatch<{}>) => ({
    updatePlugins: (plugins: UiPlugin[]) => dispatch(RootAction.actionCreators.plugins.setPlugins({
      uiPlugins: plugins
    })),
    updateConfiguration: (configuration: InvestConfiguration) =>
      dispatch(RootAction.actionCreators.configuration.setConfiguration({
        configuration: configuration
      })),
    setAuthenticationMode: (enabled: boolean) =>
      dispatch(RootAction.actionCreators.auth.setAuthenticationMode({
        enabled
      }))
  })

const connected = connect<MapStateProps, DispatchProps, ChildProps<OwnProps, GqlResponse> & RouteComponentProps<{}>>
  (mapStateToProps, mapDispatchToProps)(Main)
const graphqled = graphql<GqlResponse, OwnProps & RouteComponentProps<{}>>(APP_QUERY)(connected)
export default withRouter(graphqled)
