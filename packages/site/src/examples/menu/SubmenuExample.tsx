import {
  CxMenu,
  CxMenuToggle,
  CxMenuList,
  CxMenuItem,
  CxMenuDivider,
  CxSubmenu
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Submenus</CxMenuToggle>
      <CxMenuList>
        <CxSubmenu trigger="File">
          <CxMenuItem href="#">New</CxMenuItem>
          <CxMenuItem href="#">Open</CxMenuItem>
          <CxMenuItem href="#">Save</CxMenuItem>
        </CxSubmenu>
        <CxSubmenu trigger="Edit">
          <CxMenuItem href="#">Cut</CxMenuItem>
          <CxMenuItem href="#">Copy</CxMenuItem>
          <CxMenuItem href="#">Paste</CxMenuItem>
        </CxSubmenu>
        <CxSubmenu trigger="View">
          <CxMenuItem href="#">Zoom in</CxMenuItem>
          <CxMenuItem href="#">Zoom out</CxMenuItem>
        </CxSubmenu>
        <CxMenuDivider />
        <CxMenuItem href="#">Preferences</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
