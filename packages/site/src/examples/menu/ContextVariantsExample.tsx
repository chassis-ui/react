import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const ContextVariantsExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#" className="context info">
          Copy
        </CxMenuItem>
        <CxMenuItem href="#" className="context success">
          Save
        </CxMenuItem>
        <CxMenuItem href="#" className="context danger">
          Delete
        </CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
