import gql from 'graphql-tag'
import { Login } from 'invest-components'
import * as React from 'react'
import { MutationFunc, graphql } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { Button, Modal } from 'semantic-ui-react'
import History from '../history'
import AuthStore from '../stores/AuthStore'

type State = {
  username: string
  password: string
  failed: string
}

type GraphQLProps = {
  mutate: MutationFunc<{
    login: {
      username: string
      session: string
      roles: string[]
      name: string
    }
  }>
}

interface InjectedProps {
  authStore?: AuthStore
}

type OwnProps = {}

type Props = OwnProps & GraphQLProps & InjectedProps

class LoginPage extends React.Component<OwnProps & GraphQLProps, State> {
  state = {
    username: '',
    password: '',
    failed: ''
  }

  private authStore: AuthStore

  constructor(props: Props) {
    super(props)
    this.authStore = props.authStore!
  }

  handleClose = () => {
    // TODO: THis should be an prop, or at least a route
    History.goBack()
  }

  handleSend = () => {
    // Blank failure
    this.setState({
      failed: ''
    })

    this.props
      .mutate({
        variables: {
          username: this.state.username,
          password: this.state.password
        }
      })
      .then(value => {
        if (value.loading) {
          return
        }

        if (value.data == null || value.data.login == null || value.data.login.session == null) {
          // Failed - say so and clear password
          this.setState({
            failed: 'Incorrect username and/or password',
            password: ''
          })
        } else {
          // Cancel failure, clear password
          this.setState({
            failed: '',
            password: ''
          })

          // Dispatch action to put token in the store

          const auth = value.data.login
          this.authStore.signInOnClient(auth.username, auth.session, auth.roles)
        }
      })
  }

  handleUsernameChange = (username: string) => this.setState({ username: username })
  handlePasswordChange = (password: string) => this.setState({ password: password })

  render() {
    const { username, password } = this.state
    const { authenticated } = this.authStore

    const redirect = authenticated ? <Redirect to="/view" /> : undefined

    return (
      <div>
        {redirect}
        <Modal open={!authenticated}>
          <Modal.Header>Sign in</Modal.Header>
          <Modal.Content>
            <Login
              username={username}
              password={password}
              onUsernameChange={this.handleUsernameChange}
              onPasswordChange={this.handlePasswordChange}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button negative={true} onClick={this.handleClose}>
              Close
            </Button>
            <Button primary={true} onClick={this.handleSend}>
              Sign in
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      name
      username
      roles
      session
    }
  }
`

export default graphql(LOGIN_MUTATION)(LoginPage)
