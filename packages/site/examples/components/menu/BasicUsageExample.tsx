import { Menu, MenuToggle, MenuList, MenuItem, MenuDivider } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Toggle menu</MenuToggle>
      <MenuList>
        <MenuItem href="#">Action</MenuItem>
        <MenuItem href="#">Another action</MenuItem>
        <MenuDivider />
        <MenuItem href="#">Something else here</MenuItem>
      </MenuList>
    </Menu>
  )
}
