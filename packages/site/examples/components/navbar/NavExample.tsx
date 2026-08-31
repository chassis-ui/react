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
    <Navbar expand="small" className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
        <NavbarToggler
          aria-controls="navbarNav"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer id="navbarNav" placement="end" visible={visible} onClose={() => setVisible(false)}>
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
