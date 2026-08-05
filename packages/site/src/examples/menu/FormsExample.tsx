import { Button, CxForm, CxCheckbox, CxTextInput, CxFormLabel, Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Toggle menu</Menu.Toggle>
      <Menu.List style={{ '--cx-menu-min-width': '300px' } as React.CSSProperties}>
        <CxForm className="vstack gap-medium p-medium">
          <div>
            <CxFormLabel htmlFor="menuFormEmail">Email address</CxFormLabel>
            <CxTextInput type="email" id="menuFormEmail" placeholder="email@example.com" />
          </div>
          <div>
            <CxFormLabel htmlFor="menuFormPassword">Password</CxFormLabel>
            <CxTextInput type="password" id="menuFormPassword" placeholder="Password" />
          </div>
          <CxCheckbox id="menuRemember" label="Remember me" />
          <Button type="submit" color="primary">
            Sign in
          </Button>
        </CxForm>
      </Menu.List>
    </Menu>
  )
}
