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
  NavLink
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar expand="small" className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
        <NavbarToggler
          aria-controls="navbarNavAltMarkup"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer
          id="navbarNavAltMarkup"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <NavbarNav component="div" className="nav-pills">
              <NavLink href="#" active>
                Home
              </NavLink>
              <NavLink href="#">Link</NavLink>
              <NavLink href="#">About</NavLink>
              <NavLink disabled>Disabled</NavLink>
            </NavbarNav>
          </DrawerBody>
        </Drawer>
      </Container>
    </Navbar>
  )
}
