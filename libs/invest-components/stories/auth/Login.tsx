import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import Login from '../../src/auth/Login'

class WrapperLogin extends React.Component {

    state = {
        username: '',
        password: ''
    }

    render() {
        return (
            <Login
                username={this.state.username}
                password={this.state.password}
                onUsernameChange={u => this.setState({ username: u })}
                onPasswordChange={p => this.setState({ password: p })}
            />
        )
    }
}
storiesOf('Login', module)
    .add('as actions', () => (
        <Login
            username="partial"
            password="part"
            onUsernameChange={action('username')}
            onPasswordChange={action('password')}
        />
    )
    )
    .add('Live', () => (<WrapperLogin />))