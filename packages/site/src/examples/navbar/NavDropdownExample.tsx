import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxContainer,
  CxCollapse,
  CxDropdown,
  CxDropdownDivider,
  CxDropdownHeader,
  CxDropdownItem,
  CxDropdownItemPlain,
  CxDropdownMenu,
  CxDropdownToggle,
  CxForm,
  CxFormInput,
  CxInputGroup,
  CxInputGroupText,
  CxNav,
  CxNavItem,
  CxNavLink,
  CxNavbar,
  CxNavbarBrand,
  CxNavbarNav,
  CxNavbarText,
  CxNavbarToggler,
  CxOffcanvas,
  CxOffcanvasBody,
  CxOffcanvasHeader,
  CxOffcanvasTitle,
} from '@chassis-ui/react'

export const NavDropdownExample = () => {
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
            <CxNavbarNav>
              <CxNavItem>
                <CxNavLink href="#" active>
                  Home
                </CxNavLink>
              </CxNavItem>
              <CxNavItem>
                <CxNavLink href="#">Features</CxNavLink>
              </CxNavItem>
              <CxNavItem>
                <CxNavLink href="#">Pricing</CxNavLink>
              </CxNavItem>
              <CxDropdown variant="nav-item" popper={false}>
                <CxDropdownToggle>Dropdown link</CxDropdownToggle>
                <CxDropdownMenu>
                  <CxDropdownItem href="#">Action</CxDropdownItem>
                  <CxDropdownItem href="#">Another action</CxDropdownItem>
                  <CxDropdownDivider />
                  <CxDropdownItem href="#">Something else here</CxDropdownItem>
                </CxDropdownMenu>
              </CxDropdown>
            </CxNavbarNav>
          </CxCollapse>
        </CxContainer>
      </CxNavbar>
    </>
  )
}
