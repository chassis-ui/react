import {
  CxButton,
  CxButtonGroup,
  CxMenu,
  CxMenuDivider,
  CxMenuItem,
  CxMenuList,
  CxMenuToggle
} from '@chassis-ui/react'

export const NestedMenuExample = () => {
  return (
    <CxButtonGroup role="group" aria-label="Button group with nested menu">
      <CxButton context="primary">1</CxButton>
      <CxButton context="primary">2</CxButton>
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
