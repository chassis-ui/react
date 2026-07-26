import { useState } from 'react'
import {
  CxContainer,
  CxCollapse,
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
        <CxContainer fluid>
          <CxNavbarBrand href="#">Navbar</CxNavbarBrand>
          <CxNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CxCollapse className="navbar-collapse" visible={visible}>
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
          </CxCollapse>
        </CxContainer>
      </CxNavbar>
    </>
  )
}
