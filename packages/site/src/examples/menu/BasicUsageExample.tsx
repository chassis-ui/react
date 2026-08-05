import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Toggle menu</Menu.Toggle>
      <Menu.List>
        <Menu.Item href="#">Action</Menu.Item>
        <Menu.Item href="#">Another action</Menu.Item>
        <Menu.Divider />
        <Menu.Item href="#">Something else here</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
