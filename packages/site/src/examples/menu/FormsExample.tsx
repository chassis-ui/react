import {
  CxButton,
  CxForm,
  CxFormCheck,
  CxFormInput,
  CxFormLabel,
  CxMenu,
  CxMenuToggle,
  CxMenuList
} from '@chassis-ui/react'

export const FormsExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle context="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList style={{ '--cx-menu-min-width': '300px' } as React.CSSProperties}>
        <CxForm className="vstack gap-medium p-medium">
          <div>
            <CxFormLabel htmlFor="menuFormEmail">Email address</CxFormLabel>
            <CxFormInput type="email" id="menuFormEmail" placeholder="email@example.com" />
          </div>
          <div>
            <CxFormLabel htmlFor="menuFormPassword">Password</CxFormLabel>
            <CxFormInput type="password" id="menuFormPassword" placeholder="Password" />
          </div>
          <CxFormCheck id="menuRemember" label="Remember me" />
          <CxButton type="submit" context="primary">
            Sign in
          </CxButton>
        </CxForm>
      </CxMenuList>
    </CxMenu>
  )
}
