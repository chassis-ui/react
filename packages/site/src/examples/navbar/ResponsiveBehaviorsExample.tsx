import { useState } from 'react'
import {
  CxButton,
  CxContainer,
  CxCollapse,
  CxForm,
  CxTextInput,
  CxNavItem,
  CxNavLink,
  CxNavbar,
  CxNavbarBrand,
  CxNavbarNav,
  CxNavbarToggler
} from '@chassis-ui/react'

export const ResponsiveBehaviorsExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxNavbar expand="large" colorScheme="light" className="bg-light">
        <CxContainer fluid>
          <CxNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CxCollapse className="navbar-collapse" visible={visible}>
            <CxNavbarBrand href="#">Hidden brand</CxNavbarBrand>
            <CxNavbarNav className="me-auto mb-2 large:mb-0">
              <CxNavItem>
                <CxNavLink href="#" active>
                  Home
                </CxNavLink>
              </CxNavItem>
              <CxNavItem>
                <CxNavLink href="#">Link</CxNavLink>
              </CxNavItem>
              <CxNavItem>
                <CxNavLink href="#" disabled>
                  Disabled
                </CxNavLink>
              </CxNavItem>
            </CxNavbarNav>
            <CxForm className="d-flex">
              <CxTextInput type="search" className="me-2" placeholder="Search" />
              <CxButton type="submit" context="success" variant="outline">
                Search
              </CxButton>
            </CxForm>
          </CxCollapse>
        </CxContainer>
      </CxNavbar>
    </>
  )
}
