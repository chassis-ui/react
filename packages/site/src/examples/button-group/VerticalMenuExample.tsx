import { Button, ButtonGroup, Menu } from '@chassis-ui/react'

export const VerticalMenuExample = () => {
  return (
    <ButtonGroup vertical role="group" aria-label="Vertical button group">
      <Button color="primary">Button</Button>
      <Button color="primary">Button</Button>
      <Menu>
        <Menu.Toggle color="primary">Menu</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </Menu.List>
      </Menu>
      <Button color="primary">Button</Button>
      <Button color="primary">Button</Button>
      <Menu>
        <Menu.Toggle color="primary">Menu</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </Menu.List>
      </Menu>
      <Menu>
        <Menu.Toggle color="primary">Menu</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </Menu.List>
      </Menu>
      <Menu>
        <Menu.Toggle color="primary">Menu</Menu.Toggle>
        <Menu.List>
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </Menu.List>
      </Menu>
    </ButtonGroup>
  )
}
