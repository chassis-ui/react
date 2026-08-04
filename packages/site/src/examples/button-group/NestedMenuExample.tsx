import { Button, ButtonGroup, CxMenu, CxMenuDivider, CxMenuItem, CxMenuList, CxMenuToggle } from '@chassis-ui/react'

export const NestedMenuExample = () => {
  return (
    <ButtonGroup role="group" aria-label="Button group with nested menu">
      <Button color="primary">1</Button>
      <Button color="primary">2</Button>
      <CxMenu>
        <CxMenuToggle color="primary">Menu</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Action</CxMenuItem>
          <CxMenuItem href="#">Another action</CxMenuItem>
          <CxMenuItem href="#">Something else here</CxMenuItem>
          <CxMenuDivider />
          <CxMenuItem href="#">Separated link</CxMenuItem>
        </CxMenuList>
      </CxMenu>
    </ButtonGroup>
  )
}
