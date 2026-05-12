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

export const ExternalContentExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxCollapse id="navbarToggleExternalContent" visible={visible}>
        <div className="bg-dark p-4">
          <h5 className="text-white h4">Collapsed content</h5>
          <span className="medium:text-emphasis-inverse">Toggleable via the navbar brand.</span>
        </div>
      </CxCollapse>
      <CxNavbar colorScheme="dark" className="bg-dark">
        <CxContainer fluid>
          <CxNavbarToggler
            aria-controls="navbarToggleExternalContent"
            aria-label="Toggle navigation"
            onClick={() => setVisible(!visible)}
          />
        </CxContainer>
      </CxNavbar>
    </>
  )
}
