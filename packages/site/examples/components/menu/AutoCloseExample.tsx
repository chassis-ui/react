import { Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex flex-wrap gap-small">
      <Menu autoClose>
        <MenuToggle color="secondary">Default</MenuToggle>
        <MenuList>
          <MenuItem href="#">Copy</MenuItem>
          <MenuItem href="#">Paste</MenuItem>
          <MenuItem href="#">Delete</MenuItem>
        </MenuList>
      </Menu>

      <Menu autoClose="inside">
        <MenuToggle color="secondary">Close inside</MenuToggle>
        <MenuList>
          <MenuItem href="#">New file</MenuItem>
          <MenuItem href="#">Open</MenuItem>
          <MenuItem href="#">Save</MenuItem>
        </MenuList>
      </Menu>

      <Menu autoClose="outside">
        <MenuToggle color="secondary">Close outside</MenuToggle>
        <MenuList>
          <MenuItem href="#">Rename</MenuItem>
          <MenuItem href="#">Duplicate</MenuItem>
          <MenuItem href="#">Move to</MenuItem>
        </MenuList>
      </Menu>

      <Menu autoClose={false}>
        <MenuToggle color="secondary">Manual close</MenuToggle>
        <MenuList>
          <MenuItem href="#">Cut</MenuItem>
          <MenuItem href="#">Copy</MenuItem>
          <MenuItem href="#">Paste</MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
