import { useState } from 'react'
import {
  Container,
  Collapse,
  CxNavLink,
  CxNavbar,
  CxNavbarBrand,
  CxNavbarNav,
  CxNavbarToggler
} from '@chassis-ui/react'

export const NavExample2 = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxNavbar expand="large" colorScheme="light" className="bg-light">
        <Container fluid>
          <CxNavbarBrand href="#">Navbar</CxNavbarBrand>
          <CxNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
            <CxNavbarNav component="nav">
              <CxNavLink href="#" active>
                Home
              </CxNavLink>
              <CxNavLink href="#">Features</CxNavLink>
              <CxNavLink href="#">Pricing</CxNavLink>
              <CxNavLink href="#" disabled>
                Disabled
              </CxNavLink>
            </CxNavbarNav>
          </Collapse>
        </Container>
      </CxNavbar>
    </>
  )
}
