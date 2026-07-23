import React from 'react'
import {
  CxFormInput,
  CxInputGroup,
  CxMenu,
  CxMenuDivider,
  CxMenuItem,
  CxMenuList,
  CxMenuToggle,
} from '@chassis-ui/react'

export const ButtonsWithMenusExample = () => {
  return (
    <>
      <CxInputGroup className="mb-3">
        <CxMenu style={{ display: 'contents' }}>
          <CxMenuToggle context="secondary" variant="outline">
            Menu
          </CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">Action</CxMenuItem>
            <CxMenuItem href="#">Another action</CxMenuItem>
            <CxMenuItem href="#">Something else here</CxMenuItem>
            <CxMenuDivider />
            <CxMenuItem href="#">Separated link</CxMenuItem>
          </CxMenuList>
        </CxMenu>
        <CxFormInput aria-label="Text input with menu button" />
      </CxInputGroup>

      <CxInputGroup className="mb-3">
        <CxFormInput aria-label="Text input with menu button" />
        <CxMenu placement="bottom-end" style={{ display: 'contents' }}>
          <CxMenuToggle context="secondary" variant="outline">
            Menu
          </CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">Action</CxMenuItem>
            <CxMenuItem href="#">Another action</CxMenuItem>
            <CxMenuItem href="#">Something else here</CxMenuItem>
            <CxMenuDivider />
            <CxMenuItem href="#">Separated link</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      </CxInputGroup>

      <CxInputGroup>
        <CxMenu style={{ display: 'contents' }}>
          <CxMenuToggle context="secondary" variant="outline">
            Menu
          </CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">Action</CxMenuItem>
            <CxMenuItem href="#">Another action</CxMenuItem>
            <CxMenuItem href="#">Something else here</CxMenuItem>
            <CxMenuDivider />
            <CxMenuItem href="#">Separated link</CxMenuItem>
          </CxMenuList>
        </CxMenu>
        <CxFormInput aria-label="Text input with 2 menu buttons" />
        <CxMenu placement="bottom-end" style={{ display: 'contents' }}>
          <CxMenuToggle context="secondary" variant="outline">
            Menu
          </CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">Action</CxMenuItem>
            <CxMenuItem href="#">Another action</CxMenuItem>
            <CxMenuItem href="#">Something else here</CxMenuItem>
            <CxMenuDivider />
            <CxMenuItem href="#">Separated link</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      </CxInputGroup>
    </>
  )
}
