import { Nav, NavItem, NavOverflow } from '@chassis-ui/react'

export const Example = () => (
  <NavOverflow>
    <Nav variant="pills">
      <NavItem href="#" active>
        Home
      </NavItem>
      <NavItem href="#">Dashboard</NavItem>
      <NavItem href="#">Products</NavItem>
      <NavItem href="#">Services</NavItem>
      <NavItem href="#">Analytics</NavItem>
      <NavItem href="#">Reports</NavItem>
      <NavItem href="#">Settings</NavItem>
      <NavItem href="#">Help</NavItem>
    </Nav>
  </NavOverflow>
)
