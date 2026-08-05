import { Menu, MenuToggle, MenuList, MenuItem, MenuText } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Toggle menu</MenuToggle>
      <MenuList>
        <MenuText>Clipboard</MenuText>
        <MenuItem href="#">Copy</MenuItem>
        <MenuItem href="#">Cut</MenuItem>
        <MenuItem href="#">Paste</MenuItem>
      </MenuList>
    </Menu>
  )
}
