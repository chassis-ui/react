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
  NavbarText,
  NavbarToggler,
  NavItem,
  NavLink
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar expand="medium" className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar w/ text</NavbarBrand>
        <NavbarToggler
          aria-controls="navbarText"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer id="navbarText" placement="end" visible={visible} onClose={() => setVisible(false)}>
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
                <NavLink href="#">About</NavLink>
              </NavItem>
            </NavbarNav>
            <NavbarText>Navbar text with an inline element</NavbarText>
          </DrawerBody>
        </Drawer>
      </Container>
    </Navbar>
  )
}
