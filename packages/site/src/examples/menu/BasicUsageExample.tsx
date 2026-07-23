import React from 'react'
import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem, CxMenuDivider } from '@chassis-ui/react'

export const BasicUsageExample = () => {
  return (
    <CxMenu>
      <CxMenuToggle context="secondary">Toggle menu</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem href="#">Action</CxMenuItem>
        <CxMenuItem href="#">Another action</CxMenuItem>
        <CxMenuDivider />
        <CxMenuItem href="#">Something else here</CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
