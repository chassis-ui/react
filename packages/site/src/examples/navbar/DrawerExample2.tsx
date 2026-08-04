import { useState } from 'react'
import { Button, Container, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle, CxForm, CxTextInput, CxMenu, CxMenuDivider, CxMenuItem, CxMenuList, CxMenuToggle, Nav, Navbar } from '@chassis-ui/react'

export const DrawerExample2 = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar colorScheme="light" className="bg-light" expand="2xlarge">
      <Container fluid>
        <Navbar.Toggler
          aria-controls="drawerNavbar2"
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <CxDrawer
          id="drawerNavbar2"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <CxDrawerHeader>
            <CxDrawerTitle>Drawer</CxDrawerTitle>
          </CxDrawerHeader>
          <CxDrawerBody>
            <Navbar.Nav>
              <Nav.Item>
                <Nav.Link href="#" active>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">Link</Nav.Link>
              </Nav.Item>
              <CxMenu component="li" className="nav-item">
                <CxMenuToggle color="secondary">Menu button</CxMenuToggle>
                <CxMenuList>
                  <CxMenuItem href="#">Action</CxMenuItem>
                  <CxMenuItem href="#">Another action</CxMenuItem>
                  <CxMenuDivider />
                  <CxMenuItem href="#">Something else here</CxMenuItem>
                </CxMenuList>
              </CxMenu>
              <Nav.Item>
                <Nav.Link href="#" disabled>
                  Disabled
                </Nav.Link>
              </Nav.Item>
            </Navbar.Nav>
            <CxForm className="d-flex">
              <CxTextInput type="search" className="me-2" placeholder="Search" />
              <Button type="submit" color="success" variant="outline">
                Search
              </Button>
            </CxForm>
          </CxDrawerBody>
        </CxDrawer>
      </Container>
    </Navbar>
  )
}
