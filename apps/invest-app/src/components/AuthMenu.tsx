import * as React from 'react'
import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import { Menu, Dropdown } from 'semantic-ui-react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { RootState } from '../types'
import * as RootAction from '../redux/RootAction'

type OwnProps = {

}

type WithRouterProps = RouteComponentProps<{}>

type StateProps = {
    username?: string,
    authenticated: boolean
}

type DispatchProps = {
    clearAuth(): Action
}

type Props = OwnProps & WithRouterProps & StateProps & DispatchProps

// TODO: Move to -framework (abstracting dependency on state/RootActions)
class AuthMenu extends React.Component<Props> {

    handleLogin = () => {
        this.props.history.push('/auth/login')
    }

    handleLogout = () => {
        this.setState(
            { open: false },
            () => {
                this.props.clearAuth()
                this.props.history.push('/')
            }
        )
    }

    render() {
        const { username, authenticated } = this.props

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
        return (
            <Menu.Item name="Login" onClick={this.handleLogin} />
        )
    }

}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => ({
    username: state.auth.username,
    authenticated: state.auth.authenticated
})

const mapDispatchToProps = (dispatch: Dispatch<{}>): DispatchProps => ({
    clearAuth: () => dispatch(RootAction.actionCreators.auth.clearAuth())
})

const connected = connect(mapStateToProps, mapDispatchToProps)(AuthMenu)
const routed = withRouter<{}>(connected)
export default routed