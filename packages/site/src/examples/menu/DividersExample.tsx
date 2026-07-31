import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem, CxMenuDivider } from '@chassis-ui/react'

export const DividersExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#">Copy</CxMenuItem>
        <CxMenuItem href="#">Cut</CxMenuItem>
        <CxMenuDivider />
        <CxMenuItem href="#">Paste</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
