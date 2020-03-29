import React from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'
import { Card, Header, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import BASE_URL from '../constants'

class People extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            users: []
        }
    }

    componentDidMount() {
        // fetch a list of all users
        // fetch summary for each user, last attended + stats
        // display clickable link to profile for user

        axios({
            method: 'get',
            url: `${BASE_URL}/users`,
            timeout: 4000,
            headers: {'Authorization': 'Bearer ' + Cookie.get('token')}
          })
          .then(response => {
                console.log(response.data)
                this.setState({
                    users: response.data
                })
          })
          .catch(error => console.error('timeout exceeded'))
    }

    render() {
        return <div>
            <Header>People</Header>
            <Card.Group>
            {this.state.users.map((user) => 
                <Card>
                    <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                    <Card.Content>
                        <Card.Header>{ user.username }</Card.Header>
                        <Card.Meta>
                            <span className='date'>March 6, 2020</span>
                        </Card.Meta>
                        <Card.Meta>
                            <span>{ user.email }</span>
                        </Card.Meta>
                        <Card.Description>
                            
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Icon name='user' />
                        <Link to={`/users/${user.username}`}>profile</Link>
                    </Card.Content>
                </Card>
            )
        }
        </Card.Group>
        </div>
    }
}

export default People