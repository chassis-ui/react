import { useState } from 'react'
import {
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  Form,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarToggler,
  NavItem,
  NavLink,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar expand="medium" className="bg-even">
      <Container fluid>
        <NavbarToggler
          aria-controls="navbarTogglerNoBrand"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer
          id="navbarTogglerNoBrand"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <DrawerHeader>
            <DrawerTitle>Hidden brand</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <NavbarBrand href="#">Hidden brand</NavbarBrand>
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
            <Form className="d-flex" role="search">
              <TextInput
                type="search"
                className="me-small"
                placeholder="Search"
                aria-label="Search"
              />
              <Button type="submit" color="success" variant="outline">
                Search
              </Button>
            </Form>
          </DrawerBody>
        </Drawer>
      </Container>
    </Navbar>
  )
}
