import { useState } from 'react'
import {
  Container,
  Collapse,
  Menu,
  Navbar,
  NavItem,
  NavLink,
  NavbarBrand,
  NavbarNav,
  NavbarToggler
} from '@chassis-ui/react'

export const NavMenuExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Navbar expand="large" colorScheme="light" className="bg-light">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <Collapse className="navbar-collapse" visible={visible}>
            <NavbarNav>
              <NavItem>
                <NavLink href="#" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Features</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Pricing</NavLink>
              </NavItem>
              <Menu component="li" className="nav-item">
                <Menu.Toggle>Menu link</Menu.Toggle>
                <Menu.List>
                  <Menu.Item href="#">Action</Menu.Item>
                  <Menu.Item href="#">Another action</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item href="#">Something else here</Menu.Item>
                </Menu.List>
              </Menu>
            </NavbarNav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
