import { Nav, NavItem, NavLink } from '@chassis-ui/react'

const items = (
  <>
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
  </>
)

export const Example = () => {
  return (
    <div className="d-flex flex-column align-items-start gap-md">
      <Nav variant="segments" size="sm">
        {items}
      </Nav>
      <Nav variant="segments">{items}</Nav>
      <Nav variant="segments" size="lg">
        {items}
      </Nav>
    </div>
  )
}
