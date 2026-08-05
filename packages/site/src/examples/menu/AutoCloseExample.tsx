import { Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex flex-wrap gap-small">
      <Menu autoClose>
        <Menu.Toggle color="secondary">Default</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Copy</Menu.Item>
          <Menu.Item href="#">Paste</Menu.Item>
          <Menu.Item href="#">Delete</Menu.Item>
        </Menu.List>
      </Menu>

      <Menu autoClose="inside">
        <Menu.Toggle color="secondary">Close inside</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">New file</Menu.Item>
          <Menu.Item href="#">Open</Menu.Item>
          <Menu.Item href="#">Save</Menu.Item>
        </Menu.List>
      </Menu>

      <Menu autoClose="outside">
        <Menu.Toggle color="secondary">Close outside</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Rename</Menu.Item>
          <Menu.Item href="#">Duplicate</Menu.Item>
          <Menu.Item href="#">Move to</Menu.Item>
        </Menu.List>
      </Menu>

      <Menu autoClose={false}>
        <Menu.Toggle color="secondary">Manual close</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Cut</Menu.Item>
          <Menu.Item href="#">Copy</Menu.Item>
          <Menu.Item href="#">Paste</Menu.Item>
        </Menu.List>
      </Menu>
    </div>
  )
}
