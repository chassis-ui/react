import { Button, ButtonGroup, CxMenu, CxMenuDivider, CxMenuItem, CxMenuList, CxMenuToggle } from '@chassis-ui/react'

export const VerticalMenuExample = () => {
  return (
    <ButtonGroup vertical role="group" aria-label="Vertical button group">
      <Button color="primary">Button</Button>
      <Button color="primary">Button</Button>
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
      <Button color="primary">Button</Button>
      <Button color="primary">Button</Button>
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
