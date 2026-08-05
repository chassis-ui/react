import { CxTextInput, CxInputGroup, Menu } from '@chassis-ui/react'

export const ButtonsWithMenusExample = () => {
  return (
    <>
      <CxInputGroup className="mb-3">
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
        <CxTextInput aria-label="Text input with menu button" />
      </CxInputGroup>

      <CxInputGroup className="mb-3">
        <CxTextInput aria-label="Text input with menu button" />
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
      </CxInputGroup>

      <CxInputGroup>
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
        <CxTextInput aria-label="Text input with 2 menu buttons" />
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
      </CxInputGroup>
    </>
  )
}
