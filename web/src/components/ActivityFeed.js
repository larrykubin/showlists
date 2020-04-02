import React from 'react'
import { Card, Feed, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import BASE_URL from '../constants'
import { Link } from 'react-router-dom'

class ActivityFeed extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shows: []
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: `${BASE_URL}/feed`
        })
        .then((response) => {
            this.setState({
                shows: response.data.shows
            })
        })
    }

    render() {
        return <div>
            <Header>Feed</Header>
            
            <Feed>
                {this.state.shows.map((show) => 
                    <Feed.Event>
                        <Feed.Label>
                            <img src='/images/avatar/small/elliot.jpg' />
                        </Feed.Label>
                        <Feed.Content>
                            <Feed.Summary>
                                <Feed.User>
                                    <Link to={`/users/${show.user.id}`}>{show.user.username}</Link> 
                                </Feed.User> added <Link to={`/shows/${show.id}`}>{show.artist} @ {show.venue}, {show.city}</Link>
                                <Feed.Date>{show.created}</Feed.Date>
                            </Feed.Summary>
                            <Feed.Meta>
                            {false && <Feed.Like>
                                <Icon name='like' />4 Likes
                            </Feed.Like>}
                            </Feed.Meta>
                        </Feed.Content>
                    </Feed.Event>
                )}
            </Feed>
           
        </div>
    }
}

export default ActivityFeed