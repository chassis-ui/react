import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxContainer,
  CxCollapse,
  CxForm,
  CxFormInput,
  CxInputGroup,
  CxInputGroupText,
  CxMenu,
  CxMenuDivider,
  CxMenuItem,
  CxMenuList,
  CxMenuToggle,
  CxNav,
  CxNavItem,
  CxNavLink,
  CxNavbar,
  CxNavbarBrand,
  CxNavbarNav,
  CxNavbarText,
  CxNavbarToggler,
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
              <CxMenu component="li" className="nav-item">
                <CxMenuToggle context="secondary">Menu button</CxMenuToggle>
                <CxMenuList>
                  <CxMenuItem href="#">Action</CxMenuItem>
                  <CxMenuItem href="#">Another action</CxMenuItem>
                  <CxMenuDivider />
                  <CxMenuItem href="#">Something else here</CxMenuItem>
                </CxMenuList>
              </CxMenu>
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
