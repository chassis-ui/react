import { useState } from 'react'
import { Button, Container, Collapse, Form, TextInput, Nav, Navbar } from '@chassis-ui/react'

export const ResponsiveBehaviorsExample2 = () => {
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
            <Navbar.Nav className="me-auto mb-2 large:mb-0">
              <Nav.Item>
                <Nav.Link href="#" active>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">Link</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#" disabled>
                  Disabled
                </Nav.Link>
              </Nav.Item>
            </Navbar.Nav>
            <Form className="d-flex">
              <TextInput type="search" className="me-2" placeholder="Search" />
              <Button type="submit" color="success" variant="outline">
                Search
              </Button>
            </Form>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
