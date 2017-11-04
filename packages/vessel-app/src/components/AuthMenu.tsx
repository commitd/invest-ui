import * as React from 'react'
import { Dispatch, Action } from 'redux'
import { connect } from 'react-redux'
import Button from 'material-ui/Button'
import Menu, { MenuItem } from 'material-ui/Menu'
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

type State = {
    anchorEl?: HTMLElement,
    open: boolean
}

// TODO: Move to -framework (abstracting dependency on state/RootActions)
class AuthMenu extends React.Component<Props, State> {
    state = {
        anchorEl: undefined,
        open: false,
    }

    handleClick = (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ open: true, anchorEl: event.currentTarget })
    }

    handleRequestClose = () => {
        this.setState({ open: false })
    }

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
            <div>
                <Button
                    aria-owns={this.state.open ? 'simple-menu' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    {username}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                >
                    {/* TODO: Add change password, link to profile here... Perhaps other options if admin */}
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
        )
    }

    private renderUnauthenticated() {
        return (
            <div>
                <Button
                    onClick={this.handleLogin}
                >
                    Login
                </Button>
            </div>
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