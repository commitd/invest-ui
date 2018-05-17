import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import AuthStore from '../stores/AuthStore'

type OwnProps = {}

type WithRouterProps = RouteComponentProps<{}>

interface InjectedProps {
  authStore?: AuthStore
}

type Props = OwnProps & WithRouterProps & InjectedProps

@inject('authStore')
@observer
class AuthMenu extends React.Component<Props> {
  private authStore: AuthStore

  constructor(props: Props) {
    super(props)
    this.authStore = props.authStore!
  }

  handleLogin = () => {
    this.props.history.push('/auth/login')
  }

  handleLogout = () => {
    this.setState({ open: false }, () => {
      this.authStore.signOutOnClient()
      this.props.history.push('/')
    })
  }

  render() {
    const { username, authenticated } = this.authStore

    // If authenticated, show the
    if (authenticated && username != null) {
      return this.renderAuthenticated(username)
    } else {
      return this.renderUnauthenticated()
    }
  }

  private renderAuthenticated(username: string) {
    return (
      <Dropdown item={true} text={username}>
        <Dropdown.Menu>
          <Dropdown.Item onClick={this.handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  private renderUnauthenticated() {
    return <Menu.Item name="Login" onClick={this.handleLogin} />
  }
}

const routed = withRouter(AuthMenu)
export default routed
