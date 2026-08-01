import {
  CxButton,
  CxForm,
  CxCheckbox,
  CxTextInput,
  CxFormLabel,
  CxMenu,
  CxMenuToggle,
  CxMenuList
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList style={{ '--cx-menu-min-width': '300px' } as React.CSSProperties}>
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
          <CxButton type="submit" color="primary">
            Sign in
          </CxButton>
        </CxForm>
      </CxMenuList>
    </CxMenu>
  )
}
