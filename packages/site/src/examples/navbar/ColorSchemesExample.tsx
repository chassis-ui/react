import { useState } from 'react'
import { Button, Container, Collapse, CxForm, CxTextInput, Menu, Nav, Navbar } from '@chassis-ui/react'

export const ColorSchemesExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Navbar expand="large" colorScheme="dark" className="bg-dark">
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
              <Button type="submit" color="default" variant="outline">
                Search
              </Button>
            </CxForm>
          </Collapse>
        </Container>
      </Navbar>
      <br />
      <Navbar expand="large" colorScheme="dark" className="bg-primary">
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
              <Button type="submit" color="default" variant="outline">
                Search
              </Button>
            </CxForm>
          </Collapse>
        </Container>
      </Navbar>
      <br />
      <Navbar expand="large" colorScheme="light" style={{ backgroundColor: '#e3f2fd' }}>
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
              <Button type="submit" color="primary" variant="outline">
                Search
              </Button>
            </CxForm>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
