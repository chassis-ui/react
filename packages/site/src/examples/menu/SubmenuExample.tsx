import { Menu, MenuSubmenu, MenuToggle, MenuList, MenuItem, MenuDivider } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Submenus</MenuToggle>
      <MenuList>
        <MenuSubmenu trigger="File">
          <MenuItem href="#">New</MenuItem>
          <MenuItem href="#">Open</MenuItem>
          <MenuItem href="#">Save</MenuItem>
        </MenuSubmenu>
        <MenuSubmenu trigger="Edit">
          <MenuItem href="#">Cut</MenuItem>
          <MenuItem href="#">Copy</MenuItem>
          <MenuItem href="#">Paste</MenuItem>
        </MenuSubmenu>
        <MenuSubmenu trigger="View">
          <MenuItem href="#">Zoom in</MenuItem>
          <MenuItem href="#">Zoom out</MenuItem>
        </MenuSubmenu>
        <MenuDivider />
        <MenuItem href="#">Preferences</MenuItem>
      </MenuList>
    </Menu>
  )
}
