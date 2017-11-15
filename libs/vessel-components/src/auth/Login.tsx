import * as React from 'react'
import { Form, InputOnChangeData } from 'semantic-ui-react'

// TODO: Add validation

export type Props = {
    /** username currently entered */
    username: string,
    /** password currently entered */
    password: string,
    /** callback when  username is changed */
    onUsernameChange(usernae: string): void,
    /** callback when  password is changed */
    onPasswordChange(password: string): void
}

/** A simple username and password login form */
class Login extends React.PureComponent<Props> {

    handleUsernameChange = (e: {}, data: InputOnChangeData) => {
        this.props.onUsernameChange(data.value)
    }

    handlePasswordChange = (e: {}, data: InputOnChangeData) => {
        this.props.onPasswordChange(data.value)
    }

    render() {
        const {
            username,
            password
    } = this.props
        // const valid = validate(
        //     { username, password },
        //     { username: constraints.username, password: { presence: true } }
        // )
        // const validation = valid || {}
        return (
            <Form>
                <Form.Input
                    label="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={this.handleUsernameChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    type="password"
                    onChange={this.handlePasswordChange}
                />
            </Form>
        )
    }
}

export default Login
