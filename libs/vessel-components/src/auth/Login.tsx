import * as React from 'react'
import FormInput from '../forms/FormInput'
import Grid from 'material-ui/Grid'

// TODO: Add validation
// import validate from '../util/validate'

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
    onSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    render() {
        const {
            username,
            password,
            onUsernameChange,
            onPasswordChange,
    } = this.props
        // const valid = validate(
        //     { username, password },
        //     { username: constraints.username, password: { presence: true } }
        // )
        // const validation = valid || {}
        return (
            <Grid
                container={true}
            >
                <Grid item={true} xs={12}>
                    <form onSubmit={this.onSend}>
                        <FormInput
                            key="username"
                            id="username"
                            type="text"
                            value={username}
                            placeholder="Username"
                            label="Username"
                            /* error={validation.username} */
                            onChange={onUsernameChange}
                        />
                        <FormInput
                            key="password"
                            id="password"
                            type="password"
                            value={password}
                            placeholder="Password"
                            label="Password"
                            /* error={validation.password} */
                            onChange={onPasswordChange}
                        />
                    </form>
                </Grid>
            </Grid>
        )
    }
}

export default Login
