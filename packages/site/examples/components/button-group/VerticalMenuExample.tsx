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
    <ButtonGroup vertical role="group" aria-label="Vertical button group">
      <Button color="primary">Button</Button>
      <Button color="primary">Button</Button>
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
      <Button color="primary">Button</Button>
      <Button color="primary">Button</Button>
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
