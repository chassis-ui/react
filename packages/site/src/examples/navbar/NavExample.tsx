import { useState } from 'react'
import {
  Container,
  Collapse,
  Navbar,
  NavItem,
  NavLink,
  NavbarBrand,
  NavbarNav,
  NavbarToggler
} from '@chassis-ui/react'

export const NavExample = () => {
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
            <NavbarNav>
              <NavItem>
                <NavLink href="#" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Features</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Pricing</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" disabled>
                  Disabled
                </NavLink>
              </NavItem>
            </NavbarNav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
