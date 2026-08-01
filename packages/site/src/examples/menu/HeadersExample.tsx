import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem, CxMenuHeader } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#">Copy</CxMenuItem>
        <CxMenuItem href="#">Paste</CxMenuItem>
        <CxMenuHeader>Danger zone</CxMenuHeader>
        <CxMenuItem href="#">Delete all</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
