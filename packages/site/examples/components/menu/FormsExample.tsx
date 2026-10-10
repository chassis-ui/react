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
        <Form className="vstack gap-md p-md">
          <div>
            <FormLabel htmlFor="menuFormEmail" id="menuFormEmailLabel">
              Email address
            </FormLabel>
            <TextInput
              type="email"
              id="menuFormEmail"
              aria-labelledby="menuFormEmailLabel"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <FormLabel htmlFor="menuFormPassword" id="menuFormPasswordLabel">
              Password
            </FormLabel>
            <TextInput
              autoComplete="current-password"
              type="password"
              id="menuFormPassword"
              aria-labelledby="menuFormPasswordLabel"
              placeholder="Password"
            />
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
