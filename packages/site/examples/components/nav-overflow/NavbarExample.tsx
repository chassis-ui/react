import {
  Container,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavItem,
  NavLink,
  NavOverflow
} from '@chassis-ui/react'

export const Example = () => (
  <Navbar expand className="bg-even" aria-label="Main navigation">
    <Container fluid>
      <NavbarBrand href="#">Brand</NavbarBrand>
      <NavOverflow>
        <NavbarNav>
          <NavItem>
            <NavLink href="#" active>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Features</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Pricing</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Contact</NavLink>
          </NavItem>
        </NavbarNav>
      </NavOverflow>
    </Container>
  </Navbar>
)
