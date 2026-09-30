import { Nav, NavItem, NavOverflow } from '@chassis-ui/react'

export const Example = () => (
  <NavOverflow threshold={3}>
    <Nav variant="pills">
      <NavItem href="#" active>
        Home
      </NavItem>
      <NavItem href="#">Dashboard</NavItem>
      <NavItem href="#">Products</NavItem>
      <NavItem href="#">Services</NavItem>
      <NavItem href="#">Analytics</NavItem>
      <NavItem href="#">Reports</NavItem>
    </Nav>
  </NavOverflow>
)
