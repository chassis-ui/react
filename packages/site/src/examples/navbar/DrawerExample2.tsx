import { useState } from 'react'
import {
  Button,
  Container,
  Drawer,
  Form,
  TextInput,
  Menu,
  Navbar,
  NavItem,
  NavLink,
  NavbarNav,
  NavbarToggler
} from '@chassis-ui/react'

export const DrawerExample2 = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar colorScheme="light" className="bg-light" expand="2xlarge">
      <Container fluid>
        <NavbarToggler
          aria-controls="drawerNavbar2"
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer
          id="drawerNavbar2"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <Drawer.Header>
            <Drawer.Title>Drawer</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <NavbarNav>
              <NavItem>
                <NavLink href="#" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Link</NavLink>
              </NavItem>
              <Menu component="li" className="nav-item">
                <Menu.Toggle color="secondary">Menu button</Menu.Toggle>
                <Menu.List>
                  <Menu.Item href="#">Action</Menu.Item>
                  <Menu.Item href="#">Another action</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item href="#">Something else here</Menu.Item>
                </Menu.List>
              </Menu>
              <NavItem>
                <NavLink href="#" disabled>
                  Disabled
                </NavLink>
              </NavItem>
            </NavbarNav>
            <Form className="d-flex">
              <TextInput type="search" className="me-2" placeholder="Search" />
              <Button type="submit" color="success" variant="outline">
                Search
              </Button>
            </Form>
          </Drawer.Body>
        </Drawer>
      </Container>
    </Navbar>
  )
}
