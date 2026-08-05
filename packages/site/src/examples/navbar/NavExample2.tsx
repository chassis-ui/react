import { useState } from 'react'
import {
  Container,
  Collapse,
  Navbar,
  NavLink,
  NavbarBrand,
  NavbarNav,
  NavbarToggler
} from '@chassis-ui/react'

export const NavExample2 = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Navbar expand="large" colorScheme="light" className="bg-light">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
            <NavbarNav component="nav">
              <NavLink href="#" active>
                Home
              </NavLink>
              <NavLink href="#">Features</NavLink>
              <NavLink href="#">Pricing</NavLink>
              <NavLink href="#" disabled>
                Disabled
              </NavLink>
            </NavbarNav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
