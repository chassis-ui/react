import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Stacked submenus</Menu.Toggle>
      <Menu.List>
        <Menu.Item href="#">Level 1 action</Menu.Item>
        <Menu.Submenu trigger="Level 1 submenu" stacked>
          <Menu.Submenu.Back>Level 1</Menu.Submenu.Back>
          <Menu.Item href="#">Level 2 action</Menu.Item>
          <Menu.Item href="#">Another level 2</Menu.Item>
        </Menu.Submenu>
        <Menu.Item href="#">Another level 1</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
