import React from 'react'
import {
  CxButton,
  CxButtonGroup,
  CxMenu,
  CxMenuDivider,
  CxMenuItem,
  CxMenuList,
  CxMenuToggle,
} from '@chassis-ui/react'

export const VerticalMenuExample = () => {
  return (
    <CxButtonGroup vertical role="group" aria-label="Vertical button group">
      <CxButton context="primary">Button</CxButton>
      <CxButton context="primary">Button</CxButton>
      <CxMenu>
        <CxMenuToggle context="primary">Menu</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Action</CxMenuItem>
          <CxMenuItem href="#">Another action</CxMenuItem>
          <CxMenuItem href="#">Something else here</CxMenuItem>
          <CxMenuDivider />
          <CxMenuItem href="#">Separated link</CxMenuItem>
        </CxMenuList>
      </CxMenu>
      <CxButton context="primary">Button</CxButton>
      <CxButton context="primary">Button</CxButton>
      <CxMenu>
        <CxMenuToggle context="primary">Menu</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Action</CxMenuItem>
          <CxMenuItem href="#">Another action</CxMenuItem>
          <CxMenuItem href="#">Something else here</CxMenuItem>
          <CxMenuDivider />
          <CxMenuItem href="#">Separated link</CxMenuItem>
        </CxMenuList>
      </CxMenu>
      <CxMenu>
        <CxMenuToggle context="primary">Menu</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Action</CxMenuItem>
          <CxMenuItem href="#">Another action</CxMenuItem>
          <CxMenuItem href="#">Something else here</CxMenuItem>
          <CxMenuDivider />
          <CxMenuItem href="#">Separated link</CxMenuItem>
        </CxMenuList>
      </CxMenu>
      <CxMenu>
        <CxMenuToggle context="primary">Menu</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Action</CxMenuItem>
          <CxMenuItem href="#">Another action</CxMenuItem>
          <CxMenuItem href="#">Something else here</CxMenuItem>
          <CxMenuDivider />
          <CxMenuItem href="#">Separated link</CxMenuItem>
        </CxMenuList>
      </CxMenu>
    </CxButtonGroup>
  )
}
