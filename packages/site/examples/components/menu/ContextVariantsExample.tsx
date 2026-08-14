import { Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Toggle menu</MenuToggle>
      <MenuList>
        <MenuItem href="#" className="context info">
          Copy
        </MenuItem>
        <MenuItem href="#" className="context success">
          Save
        </MenuItem>
        <MenuItem href="#" className="context danger">
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
