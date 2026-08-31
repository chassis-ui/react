import { Menu, MenuToggle, MenuList, MenuItem, MenuHeader } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Toggle menu</MenuToggle>
      <MenuList>
        <MenuItem href="#">Copy</MenuItem>
        <MenuItem href="#">Paste</MenuItem>
        <MenuHeader>Danger zone</MenuHeader>
        <MenuItem href="#">Delete all</MenuItem>
      </MenuList>
    </Menu>
  )
}
