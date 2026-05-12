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

export const BasicUsageExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxNavbar expand="large" colorScheme="light" className="bg-light">
        <CxContainer fluid>
          <CxNavbarBrand href="#">Navbar</CxNavbarBrand>
          <CxNavbarToggler onClick={() => setVisible(!visible)} />
          <CxCollapse className="navbar-collapse" visible={visible}>
            <CxNavbarNav>
              <CxNavItem>
                <CxNavLink href="#" active>
                  Home
                </CxNavLink>
              </CxNavItem>
              <CxNavItem>
                <CxNavLink href="#">Link</CxNavLink>
              </CxNavItem>
              <CxDropdown variant="nav-item" popper={false}>
                <CxDropdownToggle context="secondary">Dropdown button</CxDropdownToggle>
                <CxDropdownMenu>
                  <CxDropdownItem href="#">Action</CxDropdownItem>
                  <CxDropdownItem href="#">Another action</CxDropdownItem>
                  <CxDropdownDivider />
                  <CxDropdownItem href="#">Something else here</CxDropdownItem>
                </CxDropdownMenu>
              </CxDropdown>
              <CxNavItem>
                <CxNavLink href="#" disabled>
                  Disabled
                </CxNavLink>
              </CxNavItem>
            </CxNavbarNav>
            <CxForm className="d-flex">
              <CxFormInput type="search" className="me-2" placeholder="Search" />
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
