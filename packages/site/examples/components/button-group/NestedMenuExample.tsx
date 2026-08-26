import {
  Button,
  ButtonGroup,
  Menu,
  MenuToggle,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <ButtonGroup role="group" aria-label="Button group with nested menu">
      <Button color="primary">1</Button>
      <Button color="primary">2</Button>
      <Menu>
        <MenuToggle color="primary">Menu</MenuToggle>
        <MenuList>
          <MenuItem href="#">Action</MenuItem>
          <MenuItem href="#">Another action</MenuItem>
          <MenuItem href="#">Something else here</MenuItem>
          <MenuDivider />
          <MenuItem href="#">Separated link</MenuItem>
        </MenuList>
      </Menu>
    </ButtonGroup>
  )
}
