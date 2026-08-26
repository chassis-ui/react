import { Nav, NavLink } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Nav component="nav" variant="pills" className="flex-column small:flex-row">
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
