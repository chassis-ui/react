import { Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Sort by</MenuToggle>
      <MenuList>
        <MenuItem component="button" selected>
          Name
        </MenuItem>
        <MenuItem component="button">Date modified</MenuItem>
        <MenuItem component="button">Size</MenuItem>
      </MenuList>
    </Menu>
  )
}
