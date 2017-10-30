import * as React from 'react'
import FormInput from '../forms/FormInput'
import Grid from 'material-ui/Grid'

// import validate from '../util/validate'
// import { publicPage } from '../util/styles'
// import { constraints } from '../util/validate'

export type Props = {
    username: string,
    password: string,
    onUsernameChange(usernae: string): void,
    onPasswordChange(password: string): void
}

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
