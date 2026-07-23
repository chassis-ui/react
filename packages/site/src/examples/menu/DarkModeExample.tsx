import React from 'react'
import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const DarkModeExample = () => {
  return (
    <div data-cx-theme="dark">
      <CxMenu>
        <CxMenuToggle context="secondary">Toggle menu</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#" active>
            Recent
          </CxMenuItem>
          <CxMenuItem href="#">All files</CxMenuItem>
          <CxMenuItem href="#">Shared with me</CxMenuItem>
        </CxMenuList>
      </CxMenu>
    </div>
  )
}
