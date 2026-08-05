import { Button, TextInput, InputGroup, Menu } from '@chassis-ui/react'

export const SegmentedButtonsExample = () => {
  return (
    <>
      <InputGroup className="mb-3">
        <Button type="button" color="secondary" variant="outline">
          Action
        </Button>
        <Menu>
          <Menu.Toggle color="secondary" variant="outline">
            <span className="visually-hidden">Toggle menu</span>
          </Menu.Toggle>
          <Menu.List>
            <Menu.Item href="#">Action</Menu.Item>
            <Menu.Item href="#">Another action</Menu.Item>
            <Menu.Item href="#">Something else here</Menu.Item>
            <Menu.Divider />
            <Menu.Item href="#">Separated link</Menu.Item>
          </Menu.List>
        </Menu>
        <TextInput aria-label="Text input with segmented menu button" />
      </InputGroup>

      <InputGroup>
        <TextInput aria-label="Text input with segmented menu button" />
        <Button type="button" color="secondary" variant="outline">
          Action
        </Button>
        <Menu placement="bottom-end">
          <Menu.Toggle color="secondary" variant="outline">
            <span className="visually-hidden">Toggle menu</span>
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
