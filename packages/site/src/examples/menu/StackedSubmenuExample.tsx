import {
  Menu,
  MenuSubmenuBack,
  MenuSubmenu,
  MenuToggle,
  MenuList,
  MenuItem
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Stacked submenus</MenuToggle>
      <MenuList>
        <MenuItem href="#">Level 1 action</MenuItem>
        <MenuSubmenu trigger="Level 1 submenu" stacked>
          <MenuSubmenuBack>Level 1</MenuSubmenuBack>
          <MenuItem href="#">Level 2 action</MenuItem>
          <MenuItem href="#">Another level 2</MenuItem>
        </MenuSubmenu>
        <MenuItem href="#">Another level 1</MenuItem>
      </MenuList>
    </Menu>
  )
}
