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
  CxCloseButton,
} from '@chassis-ui/react'

export const OffcanvasExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <CxNavbar colorScheme="light" className="bg-light">
      <CxContainer fluid>
        <CxNavbarToggler
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <CxOffcanvas id="offcanvasNavbar" placement="end" portal={false} visible={visible} onHide={() => setVisible(false)}>
          <CxOffcanvasHeader>
            <CxOffcanvasTitle>Offcanvas</CxOffcanvasTitle>
            <CxCloseButton className="text-reset" onClick={() => setVisible(false)} />
          </CxOffcanvasHeader>
          <CxOffcanvasBody>
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
          </CxOffcanvasBody>
        </CxOffcanvas>
      </CxContainer>
    </CxNavbar>
  )
}
