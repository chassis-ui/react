import {
  Button,
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
        <Button type="button" color="secondary" variant="outline">
          Action
        </Button>
        <Menu>
          <MenuToggle color="secondary" variant="outline">
            <span className="visually-hidden">Toggle menu</span>
          </MenuToggle>
          <MenuList>
            <MenuItem href="#">Action</MenuItem>
            <MenuItem href="#">Another action</MenuItem>
            <MenuItem href="#">Something else here</MenuItem>
            <MenuDivider />
            <MenuItem href="#">Separated link</MenuItem>
          </MenuList>
        </Menu>
        <TextInput aria-label="Text input with segmented menu button" />
      </InputGroup>

      <InputGroup>
        <TextInput aria-label="Text input with segmented menu button" />
        <Button type="button" color="secondary" variant="outline">
          Action
        </Button>
        <Menu placement="bottom-end">
          <MenuToggle color="secondary" variant="outline">
            <span className="visually-hidden">Toggle menu</span>
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
