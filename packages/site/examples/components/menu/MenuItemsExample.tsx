import { Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Toggle menu</MenuToggle>
      <MenuList>
        <MenuItem href="#">Regular link</MenuItem>
        <MenuItem href="#" active>
          Active link
        </MenuItem>
        <MenuItem href="#" disabled>
          Disabled link
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
