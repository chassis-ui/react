import { useState } from 'react'
import { Container, Collapse, CxMenu, CxMenuDivider, CxMenuItem, CxMenuList, CxMenuToggle, Nav, Navbar } from '@chassis-ui/react'

export const NavMenuExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Navbar expand="large" colorScheme="light" className="bg-light">
        <Container fluid>
          <Navbar.Brand href="#">Navbar</Navbar.Brand>
          <Navbar.Toggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
            <Navbar.Nav>
              <Nav.Item>
                <Nav.Link href="#" active>
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">Features</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">Pricing</Nav.Link>
              </Nav.Item>
              <CxMenu component="li" className="nav-item">
                <CxMenuToggle>Menu link</CxMenuToggle>
                <CxMenuList>
                  <CxMenuItem href="#">Action</CxMenuItem>
                  <CxMenuItem href="#">Another action</CxMenuItem>
                  <CxMenuDivider />
                  <CxMenuItem href="#">Something else here</CxMenuItem>
                </CxMenuList>
              </CxMenu>
            </Navbar.Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
