import { Container, Navbar, NavbarBrand, NavbarNav, NavItem, NavLink } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Navbar expand="medium" translucent>
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
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
        </NavbarNav>
      </Container>
    </Navbar>
  )
}
