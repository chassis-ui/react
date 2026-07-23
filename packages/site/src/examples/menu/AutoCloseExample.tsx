import React from 'react'
import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const AutoCloseExample = () => {
  return (
    <div className="d-flex flex-wrap gap-small">
      <CxMenu autoClose>
        <CxMenuToggle context="secondary">Default</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Copy</CxMenuItem>
          <CxMenuItem href="#">Paste</CxMenuItem>
          <CxMenuItem href="#">Delete</CxMenuItem>
        </CxMenuList>
      </CxMenu>

      <CxMenu autoClose="inside">
        <CxMenuToggle context="secondary">Close inside</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">New file</CxMenuItem>
          <CxMenuItem href="#">Open</CxMenuItem>
          <CxMenuItem href="#">Save</CxMenuItem>
        </CxMenuList>
      </CxMenu>

      <CxMenu autoClose="outside">
        <CxMenuToggle context="secondary">Close outside</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Rename</CxMenuItem>
          <CxMenuItem href="#">Duplicate</CxMenuItem>
          <CxMenuItem href="#">Move to</CxMenuItem>
        </CxMenuList>
      </CxMenu>

      <CxMenu autoClose={false}>
        <CxMenuToggle context="secondary">Manual close</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Cut</CxMenuItem>
          <CxMenuItem href="#">Copy</CxMenuItem>
          <CxMenuItem href="#">Paste</CxMenuItem>
        </CxMenuList>
      </CxMenu>
    </div>
  )
}
