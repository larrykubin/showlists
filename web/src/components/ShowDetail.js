import React from 'react'
import axios from 'axios'

class ShowDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showId: this.props.match.params.id,
            artist: '',
            venue: '',
            city: '',
            date: '',
            festival: '',
            creator: ''
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            
        })
    }

    render() {
        return <div>
            <h1>Show Detail {this.state.showId}</h1>
            <h2>{this.state.date}</h2>
            <h2>{this.state.artist}</h2>
            <h3>{this.state.venue} {this.state.city}</h3>
        </div>
    }
}

export default ShowDetail