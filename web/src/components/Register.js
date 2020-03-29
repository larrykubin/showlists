import React from 'react'
import axios from 'axios'
import { Button, Form, Header } from 'semantic-ui-react'
import BASE_URL from '../constants'

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
          username: '',
          email: '',
          password: '',
          passwordConfirm: ''
        }
    }

    updateUsername = (e) => {
      this.setState({
          username: e.target.value
      })
    }

    updateEmail = (e) => {
      this.setState({
          email: e.target.value
      })
    }

    updatePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    updatePasswordConfirm = (e) => {
      this.setState({
          passwordConfirm: e.target.value
      })
    }

    register = (e) => {
      axios({
          method: 'post',
          url: `${BASE_URL}/register`,
          timeout: 4000,    // 4 seconds timeout
          data: {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
          }
      })
      .then(response => {
          console.log(response)
          //Cookie.set("token", response.data.access_token)
          //Cookie.set("username", this.state.username)

          this.setState({
              saved: true,
              error: ''
          })
      })
      .catch(error => {
          this.setState({
              error: 'Invalid login or password'
          })
      })
    }

    render() {
        return <div>
            <Header>Register</Header>

            <Form>
              <Form.Field>
                <label>username</label>
                <input onChange={this.updateUsername} placeholder='username' />
              </Form.Field>
              <Form.Field>
                <label>email</label>
                <input onChange={this.updateEmail} placeholder='email' />
              </Form.Field>
              <Form.Field>
                <label>password</label>
                <input type="password" onChange={this.updatePassword} placeholder='choose a password' />
              </Form.Field>
              <Form.Field>
                <label>password confirm</label>
                <input type="password" onChange={this.updatePasswordConfirm} placeholder='type your password again' />
              </Form.Field>

              <Button onClick={this.register} type='submit'>Register</Button>
            </Form>

        </div>
    }
}

export default Register