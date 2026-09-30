import { Nav, NavItem, NavOverflow } from '@chassis-ui/react'

export const Example = () => (
  <NavOverflow>
    <Nav variant="pills">
      <NavItem href="#" active>
        Home
      </NavItem>
      <NavItem href="#">Products</NavItem>
      <NavItem href="#">Services</NavItem>
      <NavItem href="#">About</NavItem>
      <NavItem href="#">Blog</NavItem>
      <NavItem href="#">Careers</NavItem>
      <NavItem href="#" keepVisible>
        Contact
      </NavItem>
    </Nav>
  </NavOverflow>
)
