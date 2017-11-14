import * as React from 'react'
import { Action } from 'redux'
import { Dispatch, connect } from 'react-redux'
import { graphql, gql, MutationFunc } from 'react-apollo'
import { Redirect } from 'react-router-dom'
import { Login } from 'vessel-components'
import * as RootAction from '../redux/RootAction'
import { RootState } from '../types'
import Dialog, {
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'

type State = {
    username: string,
    password: string,
    failed: string,
}

type GraphQLProps = {
    mutate: MutationFunc<{
        login: {
            username: string
            session: string
        }
    }>,
}

type ConnectProps = {
    authenticated: boolean,
    setAuth(username: string, session: string): Action
}

type OwnProps = {

}

// TODO: Move to -framework (abstracting dependency on state/RootActions)
class LoginPage extends React.Component<OwnProps & ConnectProps & GraphQLProps, State> {

    state = {
        username: '',
        password: '',
        failed: ''
    }

    handleSend = () => {
        // Blank failure
        this.setState({
            failed: ''
        })

        this.props.mutate({
            variables: {
                username: this.state.username,
                password: this.state.password
            }
        }).then(value => {
            console.log(value)
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

                this.props.setAuth(value.data.login.username, value.data.login.session)
            }
        })
    }

    handleUsernameChange = (username: string) => this.setState({ username: username })
    handlePasswordChange = (password: string) => this.setState({ password: password })

    render() {
        const { username, password, failed } = this.state
        const { authenticated } = this.props

        const redirect = authenticated ? <Redirect to="/view" /> : undefined

        return (
            <div>
                {redirect}
                <Dialog open={true} >
                    <DialogTitle>Sign in</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {failed === '' ? 'Enter your username and password' : this.state.failed}
                        </DialogContentText>
                        <Login
                            username={username}
                            password={password}
                            onUsernameChange={this.handleUsernameChange}
                            onPasswordChange={this.handlePasswordChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSend} color="primary">
                            Sign in
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}

const LOGIN_MUTATION = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    username
    session
  }
}
`

const mapStateToProps = (state: RootState) => ({
    authenticated: state.auth.authenticated
})

const mapDispatchToProps = (dispatch: Dispatch<{}>) => ({
    setAuth:
    (username: string, session: string) => dispatch(RootAction.actionCreators.auth.setAuth({ username, session }))
})

export default graphql(LOGIN_MUTATION)(connect(mapStateToProps, mapDispatchToProps)(LoginPage))