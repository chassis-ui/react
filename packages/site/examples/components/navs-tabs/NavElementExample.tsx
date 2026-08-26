import { Nav, NavLink } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Nav component="nav">
      <NavLink href="#" active>
        Active
      </NavLink>
      <NavLink href="#">Link</NavLink>
      <NavLink href="#">Link</NavLink>
      <NavLink href="#" disabled>
        Disabled
      </NavLink>
    </Nav>
  )
}
