import { Nav, NavItem, NavOverflow } from '@chassis-ui/react'

export const Example = () => (
  <NavOverflow>
    <Nav variant="tabs">
      <NavItem href="#" active>
        Overview
      </NavItem>
      <NavItem href="#">Details</NavItem>
      <NavItem href="#">History</NavItem>
      <NavItem href="#">Activity</NavItem>
      <NavItem href="#">Comments</NavItem>
      <NavItem href="#">Attachments</NavItem>
      <NavItem href="#">Related</NavItem>
    </Nav>
  </NavOverflow>
)
