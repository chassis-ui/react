import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const MenuItemsExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#">Regular link</CxMenuItem>
        <CxMenuItem href="#" active>
          Active link
        </CxMenuItem>
        <CxMenuItem href="#" disabled>
          Disabled link
        </CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
