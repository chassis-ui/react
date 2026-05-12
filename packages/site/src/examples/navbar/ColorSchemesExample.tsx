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

export const ColorSchemesExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxNavbar expand="large" colorScheme="dark" className="bg-dark">
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
              <CxButton type="submit" context="light" variant="outline">
                Search
              </CxButton>
            </CxForm>
          </CxCollapse>
        </CxContainer>
      </CxNavbar>
      <br />
      <CxNavbar expand="large" colorScheme="dark" className="bg-primary">
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
              <CxButton type="submit" context="light" variant="outline">
                Search
              </CxButton>
            </CxForm>
          </CxCollapse>
        </CxContainer>
      </CxNavbar>
      <br />
      <CxNavbar expand="large" colorScheme="light" style={{ backgroundColor: '#e3f2fd' }}>
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
              <CxButton type="submit" context="primary" variant="outline">
                Search
              </CxButton>
            </CxForm>
          </CxCollapse>
        </CxContainer>
      </CxNavbar>
    </>
  )
}
