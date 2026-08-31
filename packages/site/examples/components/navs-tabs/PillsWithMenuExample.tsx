import { Nav, NavItem, NavLink, Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Nav variant="pills">
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <Menu component="li" className="nav-item">
        <MenuToggle color="secondary">Menu button</MenuToggle>
        <MenuList>
          <MenuItem href="#">Action</MenuItem>
          <MenuItem href="#">Another action</MenuItem>
          <MenuItem href="#">Something else here</MenuItem>
        </MenuList>
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
