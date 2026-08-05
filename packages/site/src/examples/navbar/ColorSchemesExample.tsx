import { useState } from 'react'
import {
  Button,
  Container,
  Collapse,
  Form,
  TextInput,
  Menu,
  Navbar,
  NavItem,
  NavLink,
  NavbarBrand,
  NavbarNav,
  NavbarToggler
} from '@chassis-ui/react'

export const ColorSchemesExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Navbar expand="large" colorScheme="dark" className="bg-dark">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
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
              <Button type="submit" color="default" variant="outline">
                Search
              </Button>
            </Form>
          </Collapse>
        </Container>
      </Navbar>
      <br />
      <Navbar expand="large" colorScheme="dark" className="bg-primary">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
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
              <Button type="submit" color="default" variant="outline">
                Search
              </Button>
            </Form>
          </Collapse>
        </Container>
      </Navbar>
      <br />
      <Navbar expand="large" colorScheme="light" style={{ backgroundColor: '#e3f2fd' }}>
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
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
              <Button type="submit" color="primary" variant="outline">
                Search
              </Button>
            </Form>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
