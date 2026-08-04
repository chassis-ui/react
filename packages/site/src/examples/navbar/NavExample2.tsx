import { useState } from 'react'
import { Container, Collapse, Nav, Navbar } from '@chassis-ui/react'

export const NavExample2 = () => {
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
            <Navbar.Nav component="nav">
              <Nav.Link href="#" active>
                Home
              </Nav.Link>
              <Nav.Link href="#">Features</Nav.Link>
              <Nav.Link href="#">Pricing</Nav.Link>
              <Nav.Link href="#" disabled>
                Disabled
              </Nav.Link>
            </Navbar.Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
