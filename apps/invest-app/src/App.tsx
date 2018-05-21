import { ApolloClient } from 'apollo-client'
import { GlobalHandler } from 'invest-framework'
import * as React from 'react'
import { withApollo } from 'react-apollo'
import Helmet from 'react-helmet'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import Main from './components/Main'

interface OwnProps {
  globalHandler: GlobalHandler
}

interface ConnectProps {
  authenticated: boolean
  title: string
}

interface WithApolloProps {
  client: ApolloClient<{}>
}

type Props = WithApolloProps & ConnectProps & OwnProps & RouteComponentProps<{}>

class App extends React.Component<Props> {
  renderMain = () => <Main globalHandler={this.props.globalHandler} />

  render() {
    const title = this.props.title
    const requireAuthentication = false

    const { authenticated } = this.props

    // If you want to force authentication (which should be a configuration option then)

    let redirect

    if (requireAuthentication) {
      redirect = !authenticated ? <Redirect to="/auth/login" /> : undefined
    } else {
      redirect = <Redirect from="/" to="/view" />
    }
    return (
      <div>
        <Helmet title={title} />
        <Switch>
          <Route path="/auth/login" component={LoginPage} />
          <Route path="/view" component={this.renderMain} />
          {redirect}
        </Switch>
      </div>
    )
  }
}

const apolloed = withApollo(App)
const routed = withRouter<OwnProps & RouteComponentProps<{}>>(apolloed)
export default routed
