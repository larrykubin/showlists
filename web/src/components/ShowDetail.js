import React from 'react'
import axios from 'axios'
import BASE_URL from '../constants'
import { Breadcrumb, Card, Container, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import style from '../styles/style'

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
            creator: '',
            username: '',
            attachments: [],
            single: false
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: `${BASE_URL}/shows/${this.state.showId}` 
        })
        .then((response) => {
            const show = response.data.show

            this.setState({
                artist: show.artist,
                venue: show.venue,
                city: show.city,
                date: show.date,
                festival: show.festival,
                username: response.data.username,
                attachments: response.data.attachments
            })
        })
    }

    toggleSingle = (id) => {
        this.setState({
            single: !this.state.single,
            attachmentId: id
        })
    }

    render() {
        return <div>
            <Breadcrumb size='large'>
                <Breadcrumb.Section>
                    <Link to={`/users/${this.state.username}`}>Shows</Link>
                </Breadcrumb.Section>
                <Breadcrumb.Divider />
                <Breadcrumb.Section>
                    {this.state.date} {this.state.artist} @ {this.state.venue}
                </Breadcrumb.Section>
            </Breadcrumb>

            <h2>{this.state.artist}</h2>
            <h3>{this.state.venue}, {this.state.city}</h3>
            <h3>{this.state.date}</h3>

            <p>added by <Link to={`/users/${this.state.username}`}>{this.state.username}</Link></p>

            {!this.state.single && <h4>Attachments</h4>}
            {this.state.single && 
                <Breadcrumb>
                    <Breadcrumb.Section>
                        <Link onClick={() => this.toggleSingle()} to={`/shows/${this.state.showId}`}>Attachments</Link>
                    </Breadcrumb.Section>
                    <Breadcrumb.Divider />
                    <Breadcrumb.Section>
                        Attachment
                    </Breadcrumb.Section>
                </Breadcrumb>
            }

            <Container id="gallery" style={style.gallery}>

            {
                this.state.single && <Image src={`https://showlists.s3-us-west-2.amazonaws.com/shows/${this.state.attachmentId}`} />
            }

            {!this.state.single && 
            <Card.Group>
                {this.state.attachments.map((attachment) => {
                    console.log(attachment)
                    return <Card>
                        <Card.Content>
                            <div style={{height: '200px', overflow: 'hidden', marginBottom: '20px'}}>
                            <Image  onClick={() => this.toggleSingle(attachment.id)} src={`https://showlists.s3-us-west-2.amazonaws.com/shows/${attachment.id}`} size='medium' rounded />

                            </div>

                            <Card.Header>Matthew</Card.Header>
                            <Card.Meta>
                                <span className='date'>Joined in 2015</span>
                            </Card.Meta>
                            <Card.Description>
                                Matthew is a musician living in Nashville.
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                        <a>
                            <Icon name='user' />
                            22 Friends
                        </a>
                        </Card.Content>
                    </Card>
                })}
                            </Card.Group>

            }
</Container>
        </div>
    }
}

export default ShowDetail