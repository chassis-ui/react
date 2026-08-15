import { useState } from 'react'
import {
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  Form,
  Icon,
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
  NavLink,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Navbar expand="medium" className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
        <NavbarToggler
          aria-controls="navbarBasicUsage"
          aria-expanded={visible}
          aria-label="Toggle navigation"
          onClick={() => setVisible(!visible)}
        />
        <Drawer
          id="navbarBasicUsage"
          placement="end"
          visible={visible}
          onClose={() => setVisible(false)}
        >
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
            <Form className="hstack gap-small" role="search">
              <TextInput type="search" placeholder="Search" aria-label="Search" />
              <Button
                type="submit"
                color="neutral"
                variant="smooth"
                className="icon-only"
                aria-label="Search"
              >
                <Icon name="search-solid" />
              </Button>
            </Form>
          </DrawerBody>
        </Drawer>
      </Container>
    </Navbar>
  )
}
