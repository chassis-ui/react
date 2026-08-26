import {
  TextInput,
  InputGroup,
  Menu,
  MenuToggle,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <InputGroup className="mb-3">
        <Menu>
          <MenuToggle color="secondary" variant="outline">
            Menu
          </MenuToggle>
          <MenuList>
            <MenuItem href="#">Action</MenuItem>
            <MenuItem href="#">Another action</MenuItem>
            <MenuItem href="#">Something else here</MenuItem>
            <MenuDivider />
            <MenuItem href="#">Separated link</MenuItem>
          </MenuList>
        </Menu>
        <TextInput aria-label="Text input with menu button" />
      </InputGroup>

      <InputGroup className="mb-3">
        <TextInput aria-label="Text input with menu button" />
        <Menu placement="bottom-end">
          <MenuToggle color="secondary" variant="outline">
            Menu
          </MenuToggle>
          <MenuList>
            <MenuItem href="#">Action</MenuItem>
            <MenuItem href="#">Another action</MenuItem>
            <MenuItem href="#">Something else here</MenuItem>
            <MenuDivider />
            <MenuItem href="#">Separated link</MenuItem>
          </MenuList>
        </Menu>
      </InputGroup>

      <InputGroup>
        <Menu>
          <MenuToggle color="secondary" variant="outline">
            Menu
          </MenuToggle>
          <MenuList>
            <MenuItem href="#">Action</MenuItem>
            <MenuItem href="#">Another action</MenuItem>
            <MenuItem href="#">Something else here</MenuItem>
            <MenuDivider />
            <MenuItem href="#">Separated link</MenuItem>
          </MenuList>
        </Menu>
        <TextInput aria-label="Text input with 2 menu buttons" />
        <Menu placement="bottom-end">
          <MenuToggle color="secondary" variant="outline">
            Menu
          </MenuToggle>
          <MenuList>
            <MenuItem href="#">Action</MenuItem>
            <MenuItem href="#">Another action</MenuItem>
            <MenuItem href="#">Something else here</MenuItem>
            <MenuDivider />
            <MenuItem href="#">Separated link</MenuItem>
          </MenuList>
        </Menu>
      </InputGroup>
    </>
  )
}
