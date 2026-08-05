import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Toggle menu</Menu.Toggle>
      <Menu.List>
        <Menu.Item href="#" className="context info">
          Copy
        </Menu.Item>
        <Menu.Item href="#" className="context success">
          Save
        </Menu.Item>
        <Menu.Item href="#" className="context danger">
          Delete
        </Menu.Item>
      </Menu.List>
    </Menu>
  )
}
