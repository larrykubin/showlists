import React from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'
import { Header, Button, Statistic, Image, Icon, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import BASE_URL from '../constants'
import style from '../styles/style'

class Profile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            shows: [],
            venues: [],
            artists: [],
            cities: [],
            photos: [],
            num_attachments: 0,
            username: this.props.match.params.username
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: `${BASE_URL}/users/${this.state.username}`,
            timeout: 4000,
            headers: {'Authorization': 'Bearer ' + Cookie.get('token')}
          })
          .then(response => {
                console.log(response.data)
                const cities = [...new Set(response.data.shows.map(item => item.city))]
                const venues = [...new Set(response.data.shows.map(item => item.venue))]
                const artists = [...new Set(response.data.shows.map(item => item.artist))]
 
                console.log(artists)
                this.setState({
                    shows: response.data.shows,
                    cities: cities,
                    venues: venues,
                    artists: artists,
                    num_attachments: response.data.num_attachments
                })
          })
          .catch(error => console.error('timeout exceeded'))
    }

    delete(id) {
        const confirmed = window.confirm("Are you sure you want to delete this show?")
        if (!confirmed) return

        axios({
            method: 'delete',
            url: `${BASE_URL}/shows/${id}`,
            timeout: 4000,
            headers: {'Authorization': 'Bearer ' + Cookie.get('token')}
          })
          .then(response => {
                console.log(response.data)
                this.setState({
                    shows: this.state.shows.filter((show) => show.id != id)
                })
          })
          .catch(error => console.error('timeout exceeded'))
    }

    render() {
        return <div>
            <Header as='h1'>{this.state.username}</Header>

            <Statistic.Group widths='five' style={style.stats}>
                <Statistic>
                    <Statistic.Value>{this.state.shows.length}</Statistic.Value>
                    <Statistic.Label>Shows</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        {this.state.cities.length}
                    </Statistic.Value>
                    <Statistic.Label>Cities</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        {this.state.venues.length}
                    </Statistic.Value>
                    <Statistic.Label>Venues</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        {this.state.artists.length}
                    </Statistic.Value>
                    <Statistic.Label>Artists</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        {this.state.num_attachments}
                    </Statistic.Value>
                    <Statistic.Label>Photos</Statistic.Label>
                </Statistic>
            </Statistic.Group>

            <Header as='h2'>
                Shows
                <Link to='/shows/form'>
                    <Button floated='right' positive>
                        <Icon name='plus'></Icon>Add Show
                    </Button>
                </Link>
            </Header>

            <Table celled striped compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Artist</Table.HeaderCell>
                        <Table.HeaderCell>Venue</Table.HeaderCell>
                        <Table.HeaderCell>Festival</Table.HeaderCell>
                        <Table.HeaderCell>City</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.shows.map((show) => 
                    <Table.Row>
                        <Table.Cell collapsing>
                            <Link to={`/shows/${show.id}`}>{show.date}</Link>
                        </Table.Cell>
                        <Table.Cell>{show.artist}</Table.Cell>
                        <Table.Cell>
                            {show.venue}
                        </Table.Cell>
                        <Table.Cell>
                            {show.festival}
                        </Table.Cell>
                        <Table.Cell>
                            {show.city}
                        </Table.Cell>
                        <Table.Cell>
                            <Link to={`/shows/${show.id}/attach/`}>
                                <Button icon><Icon name='attach'></Icon></Button>
                            </Link>
                            <Link to={`/shows/${show.id}/edit/`}>
                                <Button icon><Icon name='edit'></Icon></Button>
                            </Link>
                            <Button icon onClick={() => this.delete(show.id)}>
                                <Icon name='delete'></Icon>
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    )}
                    
                    {this.state.shows.length == 0 && 
                        <Table.Row>
                            <Table.Cell colSpan='6' style={style.norecords}>{this.state.username} has not added any shows yet.</Table.Cell>
                        </Table.Row>
                    }
                </Table.Body>
            </Table>
        </div>
    }
}

export default Profile