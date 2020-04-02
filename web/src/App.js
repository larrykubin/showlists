import React from 'react'
import './App.css'
import AttachmentForm from './components/AttachmentForm'
import Login from './components/Login'
import Profile from './components/Profile'
import People from './components/People'
import ActivityFeed from './components/ActivityFeed'
import Register from './components/Register'
import ShowDetail from './components/ShowDetail'
import ShowForm from './components/ShowForm'
import Cookie from 'js-cookie'
import { Route, Switch, Link } from 'react-router-dom'
import { Container, Menu } from 'semantic-ui-react'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      username: Cookie.get('username')
    }
  }

  callback = (username) => {
    console.log('calling callback')
    this.setState({
      username: username
    })

    console.log(this.state)
  }

  logout = () => {
    Cookie.remove('token')
    Cookie.remove('username')

    this.setState({
      username: ''
    })
    
  }

  render() {
    console.log(Cookie.get('username'))

    return (
      <div>
        <Menu fixed='top' inverted>
          <Container>
          <Menu.Item header><Link to='/'>showlists</Link></Menu.Item>
            <Menu.Item><Link to='/users'>People</Link></Menu.Item>
            {this.state.username && <Menu.Item><Link to={`/users/${this.state.username}`}>My Shows</Link></Menu.Item>}
            {!this.state.username && <Menu.Item><Link to='/register'>Register</Link></Menu.Item>}
            {!this.state.username && <Menu.Item><Link to='/login'>Login</Link></Menu.Item>}
            {this.state.username && <Menu.Item onClick={this.logout}>Logout</Menu.Item>}
          </Container>
        </Menu>

        <Container style={{ marginTop: '7em' }}>
            <Switch>
              <Route exact path='/' component={ActivityFeed} />
              <Route exact path='/users' component={People} />
              <Route path='/users/:username' render={(props) => <Profile {...props} callback={this.callback} />} />
              <Route path='/shows/form' component={ShowForm} />
              <Route path='/shows/:id/edit' component={ShowForm} />
              <Route path='/shows/:id/attach' component={AttachmentForm} />
              <Route exact path='/shows/:id' component={ShowDetail} />
              <Route path='/register' component={Register} />
              <Route path='/login' render={(props) => <Login {...props} callback={this.callback} />} />
            </Switch>
        </Container>

      </div>
    )
  }
}

export default App;
