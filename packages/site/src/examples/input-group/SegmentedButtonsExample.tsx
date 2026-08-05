import { Button, CxTextInput, CxInputGroup, Menu } from '@chassis-ui/react'

export const SegmentedButtonsExample = () => {
  return (
    <>
      <CxInputGroup className="mb-3">
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
        <CxTextInput aria-label="Text input with segmented menu button" />
      </CxInputGroup>

      <CxInputGroup>
        <CxTextInput aria-label="Text input with segmented menu button" />
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
      </CxInputGroup>
    </>
  )
}
