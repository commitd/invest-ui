import * as React from 'react'
import { Action } from 'redux'
import { Dispatch, connect } from 'react-redux'
import { graphql, MutationFunc } from 'react-apollo'
import gql from 'graphql-tag'
import { Modal, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

import { Login } from 'invest-components'

import * as RootAction from '../redux/RootAction'
import { RootState } from '../types'
import History from '../history'

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
            roles: string[]
            name: string
        }
    }>,
}

type ConnectProps = {
    authenticated: boolean,
    setAuth(username: string, session: string, name: string, roles: string[]): Action
}

type OwnProps = {

}

class LoginPage extends React.Component<OwnProps & ConnectProps & GraphQLProps, State> {

    state = {
        username: '',
        password: '',
        failed: ''
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

                const auth = value.data.login
                this.props.setAuth(auth.username, auth.session, auth.name, auth.roles)
            }
        })
    }

    handleUsernameChange = (username: string) => this.setState({ username: username })
    handlePasswordChange = (password: string) => this.setState({ password: password })

    render() {
        const { username, password } = this.state
        const { authenticated } = this.props

        const redirect = authenticated ? <Redirect to="/view" /> : undefined

        return (
            <div>
                {redirect}
                <Modal open={!authenticated} >
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
    login(username:  $username, password: $password) {
        name
        username
        roles
        session
    }
}
`

const mapStateToProps = (state: RootState) => ({
    authenticated: state.auth.authenticated
})

const mapDispatchToProps = (dispatch: Dispatch<{}>) => ({
    setAuth:
        (username: string, session: string, name: string, roles: string[]) =>
            dispatch(RootAction.actionCreators.auth.setAuth({ name, roles, username, session }))
})

export default graphql(LOGIN_MUTATION)(connect(mapStateToProps, mapDispatchToProps)(LoginPage))