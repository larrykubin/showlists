import React from 'react'
import {
  Container,
  Header,
  Menu
} from 'semantic-ui-react'

const Layout = () => (
  <div>
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          showlists
        </Menu.Item>
        <Menu.Item as='a'>Home</Menu.Item>
        <Menu.Item as='a'>Browse</Menu.Item>
        <Menu.Item as='a'>Register</Menu.Item>
        <Menu.Item as='a'>Login</Menu.Item>
      </Container>
    </Menu>

    <Container text style={{ marginTop: '7em' }}>
      <Header as='h1'>Feed</Header>
    </Container>


  </div>
)

export default Layout