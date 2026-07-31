import {
  CxNav,
  CxNavItem,
  CxNavLink,
  CxMenu,
  CxMenuToggle,
  CxMenuList,
  CxMenuItem
} from '@chassis-ui/react'

export const TabsWithMenuExample = () => {
  return (
    <CxNav>
      <CxNavItem>
        <CxNavLink href="#" active>
          Active
        </CxNavLink>
      </CxNavItem>
      <CxMenu component="li" className="nav-item">
        <CxMenuToggle color="secondary">Menu button</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Action</CxMenuItem>
          <CxMenuItem href="#">Another action</CxMenuItem>
          <CxMenuItem href="#">Something else here</CxMenuItem>
        </CxMenuList>
      </CxMenu>
      <CxNavItem>
        <CxNavLink href="#">Link</CxNavLink>
      </CxNavItem>
      <CxNavItem>
        <CxNavLink href="#" disabled>
          Disabled
        </CxNavLink>
      </CxNavItem>
    </CxNav>
  )
}
