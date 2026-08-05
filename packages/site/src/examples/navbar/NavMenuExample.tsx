import { useState } from 'react'
import { Container, Collapse, Menu, Nav, Navbar } from '@chassis-ui/react'

export const NavMenuExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Navbar expand="large" colorScheme="light" className="bg-light">
        <Container fluid>
          <Navbar.Brand href="#">Navbar</Navbar.Brand>
          <Navbar.Toggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
            <Navbar.Nav>
              <Nav.Item>
                <Nav.Link href="#" active>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">Features</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">Pricing</Nav.Link>
              </Nav.Item>
              <Menu component="li" className="nav-item">
                <Menu.Toggle>Menu link</Menu.Toggle>
                <Menu.List>
                  <Menu.Item href="#">Action</Menu.Item>
                  <Menu.Item href="#">Another action</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item href="#">Something else here</Menu.Item>
                </Menu.List>
              </Menu>
            </Navbar.Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
