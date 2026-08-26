import { Nav, NavItem, NavLink } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Nav className="justify-content-end">
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" disabled>
          Disabled
        </NavLink>
      </NavItem>
    </Nav>
  )
}
