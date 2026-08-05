import { useState } from 'react'
import {
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  Form,
  TextInput,
  Menu,
  Navbar,
  NavItem,
  NavLink,
  NavbarNav,
  NavbarToggler
} from '@chassis-ui/react'

export const DrawerExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar colorScheme="light" className="bg-light">
      <Container fluid>
        <NavbarToggler
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
          <DrawerHeader>
            <DrawerTitle>Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
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
          </DrawerBody>
        </Drawer>
      </Container>
    </Navbar>
  )
}
