import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem, CxMenuDivider } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#">Action</CxMenuItem>
        <CxMenuItem href="#">Another action</CxMenuItem>
        <CxMenuDivider />
        <CxMenuItem href="#">Something else here</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
