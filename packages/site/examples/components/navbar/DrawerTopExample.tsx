import { useState } from 'react'
import {
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
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
    <Navbar className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Top drawer</NavbarBrand>
        <NavbarToggler
          aria-controls="navbarTopDrawer"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer
          id="navbarTopDrawer"
          placement="top"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <NavbarNav className="me-auto mb-small medium:mb-0">
              <NavItem>
                <NavLink href="#" active>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#">Link</NavLink>
              </NavItem>
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
