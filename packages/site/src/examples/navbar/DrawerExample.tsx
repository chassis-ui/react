import { useState } from 'react'
import {
  CxButton,
  Container,
  CxDrawer,
  CxDrawerBody,
  CxDrawerHeader,
  CxDrawerTitle,
  CxForm,
  CxTextInput,
  CxMenu,
  CxMenuDivider,
  CxMenuItem,
  CxMenuList,
  CxMenuToggle,
  CxNavItem,
  CxNavLink,
  CxNavbar,
  CxNavbarNav,
  CxNavbarToggler
} from '@chassis-ui/react'

export const DrawerExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <CxNavbar colorScheme="light" className="bg-light">
      <Container fluid>
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
                <CxMenuToggle color="secondary">Menu button</CxMenuToggle>
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
              <CxTextInput type="search" className="me-2" placeholder="Search" />
              <CxButton type="submit" color="success" variant="outline">
                Search
              </CxButton>
            </CxForm>
          </CxDrawerBody>
        </CxDrawer>
      </Container>
    </CxNavbar>
  )
}
