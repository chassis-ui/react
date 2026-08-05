import { Nav, NavItem, NavLink, Menu } from '@chassis-ui/react'

export const TabsWithMenuExample = () => {
  return (
    <Nav>
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <Menu component="li" className="nav-item">
        <Menu.Toggle color="secondary">Menu button</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
        </Menu.List>
      </Menu>
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
