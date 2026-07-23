import React from 'react'
import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem, CxMenuHeader } from '@chassis-ui/react'

export const HeadersExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle context="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#">Copy</CxMenuItem>
        <CxMenuItem href="#">Paste</CxMenuItem>
        <CxMenuHeader>Danger zone</CxMenuHeader>
        <CxMenuItem href="#">Delete all</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
