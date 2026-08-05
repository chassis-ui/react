import { Button, ButtonGroup, Menu } from '@chassis-ui/react'

export const NestedMenuExample = () => {
  return (
    <ButtonGroup role="group" aria-label="Button group with nested menu">
      <Button color="primary">1</Button>
      <Button color="primary">2</Button>
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
