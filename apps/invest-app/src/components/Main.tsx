import gql from 'graphql-tag'
import { Layout, Login, NavBar } from 'invest-components'
import { FallbackView, GlobalHandler, PluginListSidebar, PluginViewManager } from 'invest-framework'
import { InvestConfiguration, PluginWithIntent, UiPlugin } from 'invest-types'
import { searchToIntent } from 'invest-utils'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { ChildProps, graphql } from 'react-apollo'
import Helmet from 'react-helmet'
import { Route, RouteComponentProps, matchPath, withRouter } from 'react-router-dom'
import AuthStore from '../stores/AuthStore'
import ConfigurationStore from '../stores/ConfigurationStore'
import UiPluginStore from '../stores/UiPluginStore'
import { canUserSeePlugin } from '../utils/RoleUtils'
import AuthMenu from './AuthMenu'

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

interface InjectedProps {
  authStore?: AuthStore
  uiPluginStore?: UiPluginStore
  configurationStore?: ConfigurationStore
}

type Props = ChildProps<OwnProps, GqlResponse> & RouteComponentProps<{}> & InjectedProps

interface State {
  sidebarOpen: boolean
}

// Note that we use the URL to decide on the plugin and we do it internally here.
// We don't rely on the Route from
@inject('authStore', 'uiPluginStore', 'configurationStore')
@observer
class Main extends React.Component<Props, State> {
  state: State = {
    sidebarOpen: true
  }

  private authStore: AuthStore
  private uiPluginStore: UiPluginStore
  private configurationStore: ConfigurationStore

  constructor(props: Props) {
    super(props)
    this.authStore = props.authStore!
    this.uiPluginStore = props.uiPluginStore!
    this.configurationStore = props.configurationStore!
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
    this.setState(state => ({
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
    const path = matchPath<{ pluginId?: string }>(this.props.history.location.pathname, {
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
    const allPlugins = this.uiPluginStore.uiPlugins
    return allPlugins.filter(p => canUserSeePlugin(this.authStore, p))
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data && !nextProps.data.loading) {
      const data = nextProps.data
      if (data.investServer && data.investServer.uiPlugins) {
        this.uiPluginStore.uiPlugins = data.investServer.uiPlugins
      }
      if (data.investServer && data.investServer.configuration) {
        this.configurationStore.configuration = data.investServer.configuration
      }
      if (data.investServer && data.investServer.authentication) {
        this.authStore.setAuthenticationMode(data.investServer.authentication.enabled)
      }
    }
  }

  render() {
    const serverUrl = this.guessServerUrl(
      this.props.data && this.props.data.investServer && this.props.data.investServer.configuration
        ? this.props.data.investServer.configuration
        : undefined
    )

    let plugins = this.getPlugins()
    const title =
      (this.props.data && this.props.data.investServer && this.props.data.investServer.configuration.title) || 'Invest'
    const authenticationMode =
      this.props.data && this.props.data.investServer && this.props.data.investServer.authentication.enabled

    const selectedPlugin = this.findSelectedPlugin()

    const plugin: PluginWithIntent | undefined = selectedPlugin
      ? {
          plugin: selectedPlugin,
          intent: searchToIntent(this.props.location.search)
        }
      : undefined

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
      </div>
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

const graphqled = graphql<OwnProps & RouteComponentProps<{}>, GqlResponse, {}>(APP_QUERY)(Main)
const routed = withRouter<OwnProps & RouteComponentProps<{}>>(graphqled)
export default routed
