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

const NavLinks = () => (
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
    <NavItem>
      <NavLink href="#">Contact</NavLink>
    </NavItem>
  </NavbarNav>
)

export const Example = () => {
  const [visibleSolid, setVisibleSolid] = useState(false)
  const [visibleDark, setVisibleDark] = useState(false)
  const [visibleLight, setVisibleLight] = useState(false)

  return (
    <>
      <Navbar expand="medium" color="primary" variant="solid">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-controls="navbarColorSolid"
            aria-expanded={visibleSolid}
            aria-label="Toggle navigation"
            onClick={() => setVisibleSolid(!visibleSolid)}
          />
          <Drawer
            id="navbarColorSolid"
            placement="end"
            visible={visibleSolid}
            onClose={() => setVisibleSolid(false)}
          >
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <NavLinks />
              <Form className="d-flex" role="search">
                <TextInput
                  type="search"
                  className="me-small"
                  placeholder="Search"
                  aria-label="Search"
                />
                <Button type="submit" color="default">
                  Search
                </Button>
              </Form>
            </DrawerBody>
          </Drawer>
        </Container>
      </Navbar>
      <br />
      <Navbar expand="medium" color="primary" className="bg-even" data-cx-theme="dark">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-controls="navbarColorDark"
            aria-expanded={visibleDark}
            aria-label="Toggle navigation"
            onClick={() => setVisibleDark(!visibleDark)}
          />
          <Drawer
            id="navbarColorDark"
            placement="end"
            visible={visibleDark}
            onClose={() => setVisibleDark(false)}
          >
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <NavLinks />
              <Form className="d-flex" role="search">
                <TextInput
                  type="search"
                  className="me-small"
                  data-cx-theme="light"
                  placeholder="Search"
                  aria-label="Search"
                />
                <Button type="submit" color="default">
                  Search
                </Button>
              </Form>
            </DrawerBody>
          </Drawer>
        </Container>
      </Navbar>
      <br />
      <Navbar expand="medium" color="primary" className="bg-even" data-cx-theme="light">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-controls="navbarColorLight"
            aria-expanded={visibleLight}
            aria-label="Toggle navigation"
            onClick={() => setVisibleLight(!visibleLight)}
          />
          <Drawer
            id="navbarColorLight"
            placement="end"
            visible={visibleLight}
            onClose={() => setVisibleLight(false)}
          >
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <NavLinks />
              <Form className="d-flex" role="search">
                <TextInput
                  type="search"
                  className="me-small"
                  placeholder="Search"
                  aria-label="Search"
                />
                <Button type="submit" color="primary" variant="outline">
                  Search
                </Button>
              </Form>
            </DrawerBody>
          </Drawer>
        </Container>
      </Navbar>
    </>
  )
}
