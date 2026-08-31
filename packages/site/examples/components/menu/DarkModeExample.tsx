import { Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div data-cx-theme="dark">
      <Menu>
        <MenuToggle color="secondary">Toggle menu</MenuToggle>
        <MenuList>
          <MenuItem href="#" active>
            Recent
          </MenuItem>
          <MenuItem href="#">All files</MenuItem>
          <MenuItem href="#">Shared with me</MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
