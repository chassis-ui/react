import {
  CxMenu,
  CxMenuToggle,
  CxMenuList,
  CxMenuItem,
  CxSubmenu,
  CxSubmenuBack
} from '@chassis-ui/react'

export const StackedSubmenuExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle context="secondary">Stacked submenus</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#">Level 1 action</CxMenuItem>
        <CxSubmenu trigger="Level 1 submenu" stacked>
          <CxSubmenuBack>Level 1</CxSubmenuBack>
          <CxMenuItem href="#">Level 2 action</CxMenuItem>
          <CxMenuItem href="#">Another level 2</CxMenuItem>
        </CxSubmenu>
        <CxMenuItem href="#">Another level 1</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
