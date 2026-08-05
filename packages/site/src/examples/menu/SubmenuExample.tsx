import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Submenus</Menu.Toggle>
      <Menu.List>
        <Menu.Submenu trigger="File">
          <Menu.Item href="#">New</Menu.Item>
          <Menu.Item href="#">Open</Menu.Item>
          <Menu.Item href="#">Save</Menu.Item>
        </Menu.Submenu>
        <Menu.Submenu trigger="Edit">
          <Menu.Item href="#">Cut</Menu.Item>
          <Menu.Item href="#">Copy</Menu.Item>
          <Menu.Item href="#">Paste</Menu.Item>
        </Menu.Submenu>
        <Menu.Submenu trigger="View">
          <Menu.Item href="#">Zoom in</Menu.Item>
          <Menu.Item href="#">Zoom out</Menu.Item>
        </Menu.Submenu>
        <Menu.Divider />
        <Menu.Item href="#">Preferences</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
