import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Toggle menu</Menu.Toggle>
      <Menu.List>
        <Menu.Item href="#">Regular link</Menu.Item>
        <Menu.Item href="#" active>
          Active link
        </Menu.Item>
        <Menu.Item href="#" disabled>
          Disabled link
        </Menu.Item>
      </Menu.List>
    </Menu>
  )
}
