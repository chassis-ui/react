import {
  Button,
  Form,
  Checkbox,
  TextInput,
  FormLabel,
  Menu,
  MenuToggle,
  MenuList
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Toggle menu</MenuToggle>
      <MenuList style={{ '--cx-menu-min-width': '300px' } as React.CSSProperties}>
        <Form className="vstack gap-medium p-medium">
          <div>
            <FormLabel htmlFor="menuFormEmail">Email address</FormLabel>
            <TextInput type="email" id="menuFormEmail" placeholder="email@example.com" />
          </div>
          <div>
            <FormLabel htmlFor="menuFormPassword">Password</FormLabel>
            <TextInput type="password" id="menuFormPassword" placeholder="Password" />
          </div>
          <Checkbox id="menuRemember" label="Remember me" />
          <Button type="submit" color="primary">
            Sign in
          </Button>
        </Form>
      </MenuList>
    </Menu>
  )
}
