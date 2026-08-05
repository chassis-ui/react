import { useState } from 'react'
import { Button, Container, Drawer, CxForm, CxTextInput, Menu, Nav, Navbar } from '@chassis-ui/react'

export const DrawerExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar colorScheme="light" className="bg-light">
      <Container fluid>
        <Navbar.Toggler
          aria-controls="drawerNavbar"
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer
          id="drawerNavbar"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <Drawer.Header>
            <Drawer.Title>Drawer</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Navbar.Nav>
              <Nav.Item>
                <Nav.Link href="#" active>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">Link</Nav.Link>
              </Nav.Item>
              <Menu component="li" className="nav-item">
                <Menu.Toggle color="secondary">Menu button</Menu.Toggle>
                <Menu.List>
                  <Menu.Item href="#">Action</Menu.Item>
                  <Menu.Item href="#">Another action</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item href="#">Something else here</Menu.Item>
                </Menu.List>
              </Menu>
              <Nav.Item>
                <Nav.Link href="#" disabled>
                  Disabled
                </Nav.Link>
              </Nav.Item>
            </Navbar.Nav>
            <CxForm className="d-flex">
              <CxTextInput type="search" className="me-2" placeholder="Search" />
              <Button type="submit" color="success" variant="outline">
                Search
              </Button>
            </CxForm>
          </Drawer.Body>
        </Drawer>
      </Container>
    </Navbar>
  )
}
