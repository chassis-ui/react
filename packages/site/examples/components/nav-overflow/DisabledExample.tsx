import { Nav, NavItem, NavOverflow } from '@chassis-ui/react'

export const Example = () => (
  <NavOverflow>
    <Nav variant="segments">
      <NavItem href="#" active>
        Active
      </NavItem>
      <NavItem href="#">Link</NavItem>
      <NavItem href="#">Another link</NavItem>
      <NavItem href="#" disabled>
        Disabled
      </NavItem>
      <NavItem href="#">More content</NavItem>
      <NavItem href="#">Even more</NavItem>
    </Nav>
  </NavOverflow>
)
