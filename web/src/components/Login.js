import React from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'
import { Button, Form, Header, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import BASE_URL from '../constants'

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            error: '',
            loggedIn: false
        }
    }

    login = () => {
        /**
         * Authenticate and store token in cookie
         */
        axios({
            method: 'post',
            url: `${BASE_URL}/login`,
            timeout: 4000,    // 4 seconds timeout
            data: {
              username: this.state.username,
              password: this.state.password
            }
        })
        .then(response => {
            Cookie.set("token", response.data.access_token)
            Cookie.set("username", this.state.username)

            this.props.callback(this.state.username)
            
            this.setState({
                loggedIn: true,
                error: ''
            })
        })
        .catch(error => {
            this.setState({
                error: 'Invalid login or password'
            })
        })
    }

    updateUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    updatePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    render() {
        return <div>
            
            <Header>Login</Header>

            {
                this.state.loggedIn && <Redirect to={`/users/${this.state.username}`} />
            }

            {
                this.state.error && <Message negative>
                    <Message.Header>Oops!</Message.Header>
                    <p>Invalid username or password</p>
                </Message>
            }
            <Form>
                <Form.Field>
                    <label>username</label>
                    <input onChange={this.updateUsername} value={this.state.username} placeholder='username' />
                </Form.Field>

                <Form.Field>
                    <label>password</label>
                    <input type="password" onChange={this.updatePassword} value={this.state.password} placeholder='password' />
                </Form.Field>

                <Button type='submit' onClick={this.login}>Submit</Button>
            </Form>

        </div>
    }
}

export default Login