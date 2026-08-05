import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Sort by</Menu.Toggle>
      <Menu.List>
        <Menu.Item component="button" selected>
          Name
        </Menu.Item>
        <Menu.Item component="button">Date modified</Menu.Item>
        <Menu.Item component="button">Size</Menu.Item>
      </Menu.List>
    </Menu>
  )
}
