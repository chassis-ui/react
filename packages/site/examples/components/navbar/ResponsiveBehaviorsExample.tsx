import { useState } from 'react'
import {
  Button,
  Container,
  Collapse,
  Form,
  TextInput,
  Navbar,
  NavItem,
  NavLink,
  NavbarBrand,
  NavbarNav,
  NavbarToggler
} from '@chassis-ui/react'

export const ResponsiveBehaviorsExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Navbar expand="large" colorScheme="light" className="bg-light">
        <Container fluid>
          <NavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
            <NavbarBrand href="#">Hidden brand</NavbarBrand>
            <NavbarNav className="me-auto mb-2 large:mb-0">
              <NavItem>
                <NavLink href="#" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Link</NavLink>
              </NavItem>
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
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
