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
    <Navbar expand="medium" className="bg-even" data-cx-theme="dark">
      <Container fluid>
        <NavbarBrand href="#">Dark navbar</NavbarBrand>
        <NavbarToggler
          aria-controls="navbarDark"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer id="navbarDark" placement="end" visible={visible} onClose={() => setVisible(false)}>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="mb-small medium:mb-0">
            <NavbarNav className="me-auto">
              <NavItem>
                <NavLink href="#" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Link</NavLink>
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
              <NavItem>
                <NavLink disabled>Disabled</NavLink>
              </NavItem>
            </NavbarNav>
          </DrawerBody>
        </Drawer>
      </Container>
    </Navbar>
  )
}
