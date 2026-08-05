import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Toggle menu</Menu.Toggle>
      <Menu.List>
        <Menu.Item href="#">Copy</Menu.Item>
        <Menu.Item href="#">Cut</Menu.Item>
        <Menu.Divider />
        <Menu.Item href="#">Paste</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
