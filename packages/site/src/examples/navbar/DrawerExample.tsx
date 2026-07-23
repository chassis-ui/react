import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxContainer,
  CxCollapse,
  CxDrawer,
  CxDrawerBody,
  CxDrawerHeader,
  CxDrawerTitle,
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

export const DrawerExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <CxNavbar colorScheme="light" className="bg-light">
      <CxContainer fluid>
        <CxNavbarToggler
          aria-controls="drawerNavbar"
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <CxDrawer
          id="drawerNavbar"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
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
          </CxDrawerBody>
        </CxDrawer>
      </CxContainer>
    </CxNavbar>
  )
}
