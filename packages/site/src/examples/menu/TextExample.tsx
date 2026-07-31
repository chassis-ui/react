import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem, CxMenuText } from '@chassis-ui/react'

export const TextExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuText>Clipboard</CxMenuText>
        <CxMenuItem href="#">Copy</CxMenuItem>
        <CxMenuItem href="#">Cut</CxMenuItem>
        <CxMenuItem href="#">Paste</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
