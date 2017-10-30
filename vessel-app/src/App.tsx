import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Main from './components/Main'

import { RootState } from './types'

interface Props {
  authenticated: boolean
}

class App extends React.Component<Props> {

  render() {
    const title = 'Vessel'
    const { authenticated } = this.props

    console.log(authenticated)

    const redirect = !authenticated ? <Redirect to="/auth/login" /> : undefined

    return (
      <div>
        <Helmet title={title} />
        <Switch>
          <Route path="/auth/login" component={LoginPage} />
          {redirect}
          <Route path="/view" component={Main} />
        </Switch>

      </div >
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  authenticated: state.auth.authenticated
})

export default withRouter(connect(mapStateToProps)(App))