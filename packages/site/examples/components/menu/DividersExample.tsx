import { Menu, MenuToggle, MenuList, MenuItem, MenuDivider } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Toggle menu</MenuToggle>
      <MenuList>
        <MenuItem href="#">Copy</MenuItem>
        <MenuItem href="#">Cut</MenuItem>
        <MenuDivider />
        <MenuItem href="#">Paste</MenuItem>
      </MenuList>
    </Menu>
  )
}
