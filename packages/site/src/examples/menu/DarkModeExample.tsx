import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div data-cx-theme="dark">
      <Menu>
        <Menu.Toggle color="secondary">Toggle menu</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#" active>
            Recent
          </Menu.Item>
          <Menu.Item href="#">All files</Menu.Item>
          <Menu.Item href="#">Shared with me</Menu.Item>
        </Menu.List>
      </Menu>
    </div>
  )
}
