import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Toggle menu</Menu.Toggle>
      <Menu.List>
        <Menu.Text>Clipboard</Menu.Text>
        <Menu.Item href="#">Copy</Menu.Item>
        <Menu.Item href="#">Cut</Menu.Item>
        <Menu.Item href="#">Paste</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
