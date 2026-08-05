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
  NavbarToggler,
  MenuToggle,
  MenuList,
  MenuItem,
  MenuDivider
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
                <MenuToggle>Menu link</MenuToggle>
                <MenuList>
                  <MenuItem href="#">Action</MenuItem>
                  <MenuItem href="#">Another action</MenuItem>
                  <MenuDivider />
                  <MenuItem href="#">Something else here</MenuItem>
                </MenuList>
              </Menu>
            </NavbarNav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  )
}
