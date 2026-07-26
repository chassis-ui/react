import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const SelectedExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle context="secondary">Sort by</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem component="button" selected>
          Name
        </CxMenuItem>
        <CxMenuItem component="button">Date modified</CxMenuItem>
        <CxMenuItem component="button">Size</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
