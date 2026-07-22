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
  CxDrawer,
  CxDrawerBody,
  CxDrawerHeader,
  CxDrawerTitle,
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
} from '@chassis-ui/react'

export const DrawerExample2 = () => {
  const [visible, setVisible] = useState(false)
  return (
    <CxNavbar colorScheme="light" className="bg-light" expand="2xlarge">
      <CxContainer fluid>
        <CxNavbarToggler
          aria-controls="drawerNavbar2"
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <CxDrawer id="drawerNavbar2" placement="end" visible={visible} onClose={() => setVisible(false)}>
          <CxDrawerHeader>
            <CxDrawerTitle>Drawer</CxDrawerTitle>
          </CxDrawerHeader>
          <CxDrawerBody>
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
          </CxDrawerBody>
        </CxDrawer>
      </CxContainer>
    </CxNavbar>
  )
}
