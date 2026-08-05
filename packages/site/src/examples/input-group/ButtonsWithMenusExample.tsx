import { TextInput, InputGroup, Menu } from '@chassis-ui/react'

export const ButtonsWithMenusExample = () => {
  return (
    <>
      <InputGroup className="mb-3">
        <Menu>
          <Menu.Toggle color="secondary" variant="outline">
            Menu
          </Menu.Toggle>
          <Menu.List>
            <Menu.Item href="#">Action</Menu.Item>
            <Menu.Item href="#">Another action</Menu.Item>
            <Menu.Item href="#">Something else here</Menu.Item>
            <Menu.Divider />
            <Menu.Item href="#">Separated link</Menu.Item>
          </Menu.List>
        </Menu>
        <TextInput aria-label="Text input with menu button" />
      </InputGroup>

      <InputGroup className="mb-3">
        <TextInput aria-label="Text input with menu button" />
        <Menu placement="bottom-end">
          <Menu.Toggle color="secondary" variant="outline">
            Menu
          </Menu.Toggle>
          <Menu.List>
            <Menu.Item href="#">Action</Menu.Item>
            <Menu.Item href="#">Another action</Menu.Item>
            <Menu.Item href="#">Something else here</Menu.Item>
            <Menu.Divider />
            <Menu.Item href="#">Separated link</Menu.Item>
          </Menu.List>
        </Menu>
      </InputGroup>

      <InputGroup>
        <Menu>
          <Menu.Toggle color="secondary" variant="outline">
            Menu
          </Menu.Toggle>
          <Menu.List>
            <Menu.Item href="#">Action</Menu.Item>
            <Menu.Item href="#">Another action</Menu.Item>
            <Menu.Item href="#">Something else here</Menu.Item>
            <Menu.Divider />
            <Menu.Item href="#">Separated link</Menu.Item>
          </Menu.List>
        </Menu>
        <TextInput aria-label="Text input with 2 menu buttons" />
        <Menu placement="bottom-end">
          <Menu.Toggle color="secondary" variant="outline">
            Menu
          </Menu.Toggle>
          <Menu.List>
            <Menu.Item href="#">Action</Menu.Item>
            <Menu.Item href="#">Another action</Menu.Item>
            <Menu.Item href="#">Something else here</Menu.Item>
            <Menu.Divider />
            <Menu.Item href="#">Separated link</Menu.Item>
          </Menu.List>
        </Menu>
      </InputGroup>
    </>
  )
}
