import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { ApolloClient, withApollo } from 'react-apollo'
import { GlobalHandler, newGlobalHandler } from 'vessel-framework'

import LoginPage from './components/LoginPage'
import Main from './components/Main'

import { RootState } from './types'

interface OwnProps {

}

interface ConnectProps {
  authenticated: boolean,
  session?: string
}

interface WithApolloProps {
  client: ApolloClient
}

type Props = WithApolloProps & ConnectProps & OwnProps

class App extends React.Component<Props> {

  globalHandler: GlobalHandler

  constructor(props: Props) {
    super(props)
    this.globalHandler = newGlobalHandler(props.client, () => this.props.session)
  }

  renderMain = () => <Main globalHandler={this.globalHandler} />

  render() {
    // Should come from settings
    const title = 'Vessel'
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

      </div >
    )
  }
}

const mapStateToProps = (state: RootState, props: OwnProps) => ({
  authenticated: state.auth.authenticated,
  session: state.auth.session
})

export default withRouter(connect(mapStateToProps)(withApollo(App)))