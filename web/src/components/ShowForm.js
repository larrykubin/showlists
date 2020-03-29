import React from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'
import { Button, Form, Header, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { DateInput } from 'semantic-ui-calendar-react';
import BASE_URL from '../constants'

class ShowForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: null,
            artist: '',
            venue: '',
            city: '',
            date: '',
            festival: '',
            error: '',
            saved: false
        }
    }

    componentDidMount() {
         // if there is an id, fetch the existing show record
         const showId = this.props.match.params.id

         if (showId) {
            axios({
                method: 'get',
                url: `${BASE_URL}/shows/${showId}`
            })
            .then((response) => {
                const show = response.data.show
                this.setState({
                    id: showId,
                    artist: show.artist,
                    venue: show.venue,
                    city: show.city,
                    date: show.date,
                    festival: show.festival
                })
            })
         }
    }

    save = () => {
        const endpoint = this.state.id ? `shows/${this.state.id}` : 'shows'

        console.log(this.state)
        axios({
            method: this.state.id ? 'put' : 'post',
            url: `${BASE_URL}/${endpoint}`,
            timeout: 4000,
            data: {
              id: this.state.id,
              artist: this.state.artist,
              venue: this.state.venue,
              city: this.state.city,
              date: this.state.date,
              festival: this.state.festival
            },
            headers: {'Authorization': 'Bearer ' + Cookie.get('token')}
        })
        .then(response => {
            this.setState({
                saved: true,
                error: ''
            })
        })
        .catch(error => {
            this.setState({
                error: 'Could not save show'
            })
        })
    }

    updateArtist = (e) => {
        this.setState({
            artist: e.target.value
        })
    }

    updateVenue = (e) => {
        this.setState({
            venue: e.target.value
        })
    }

    updateCity = (e) => {
        this.setState({
            city: e.target.value
        })
    }

    updateDate = (e, {name, value}) => {
        this.setState({
            date: value
        })
    }

    updateFestival = (e) => {
        this.setState({
            festival: e.target.value
        })
    }

    render() {
        return <div>
            
            <Header>Add Show</Header>

            {
                this.state.saved && <Redirect to={`/users/${Cookie.get('username')}`} />
            }

            {
                this.state.error && <Message negative>
                    <Message.Header>Oops!</Message.Header>
                    <p>Invalid username or password</p>
                </Message>
            }
            <Form>
            <DateInput
                    name="date"
                    placeholder="Date"
                    dateFormat="YYYY-MM-DD"
                    value={this.state.date}
                    iconPosition="left"
                    inline={false}
                    animation="none"
                    onChange={this.updateDate}
                />

                <Form.Field>
                    <label>Artist</label>
                    <input onChange={this.updateArtist} value={this.state.artist} placeholder='artist' />
                </Form.Field>

                <Form.Field>
                    <label>Venue</label>
                    <input onChange={this.updateVenue} value={this.state.venue} placeholder='venue' />
                </Form.Field>

                <Form.Field>
                    <label>City</label>
                    <input onChange={this.updateCity} value={this.state.city} placeholder='city' />
                </Form.Field>

                <Form.Field>
                    <label>Festival</label>
                    <input onChange={this.updateFestival} value={this.state.festival} placeholder='festival' />
                </Form.Field>

                <Button type='submit' onClick={this.save}>save</Button>
            </Form>

        </div>
    }
}

export default ShowForm