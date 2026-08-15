import { useState } from 'react'
import {
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuToggle,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  NavItem,
  NavLink
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar expand="medium" className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
        <NavbarToggler
          aria-controls="navbarNavMenu"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer
          id="navbarNavMenu"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <NavbarNav>
              <NavItem>
                <NavLink href="#" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Link</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">About</NavLink>
              </NavItem>
              <Menu component="li" className="nav-item">
                <MenuToggle component={NavLink}>Menu</MenuToggle>
                <MenuList>
                  <MenuItem href="#">Action</MenuItem>
                  <MenuItem href="#">Another action</MenuItem>
                  <MenuDivider />
                  <MenuItem href="#">Something else here</MenuItem>
                </MenuList>
              </Menu>
            </NavbarNav>
          </DrawerBody>
        </Drawer>
      </Container>
    </Navbar>
  )
}
