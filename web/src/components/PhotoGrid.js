import React from 'react'
import { Card, Header, Icon, Image } from 'semantic-ui-react'

class PhotoGrid extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    componentDidMount() {
        // fetch recent photos
    }

    render() {
        return <div>
            <Header>Home</Header>
            {false &&
            <Card>
                <Image src='/images/avatar/large/matthew.png' wrapped ui={false} />
                <Card.Content>
                    <Card.Header>Thundercat</Card.Header>
                    <Card.Meta>
                        <span className='date'>March 6, 2020</span>
                    </Card.Meta>
                    <Card.Meta>
                        <span>added by parttimelarry</span>
                    </Card.Meta>
                    <Card.Description>
                        Fun with friends
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Icon name='user' />
                    22 Friends
                </Card.Content>
            </Card>}
        </div>
    }
}

export default PhotoGrid