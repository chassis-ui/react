import { Button, CxTextInput, CxInputGroup, CxMenu, CxMenuDivider, CxMenuItem, CxMenuList, CxMenuToggle } from '@chassis-ui/react'

export const SegmentedButtonsExample = () => {
  return (
    <>
      <CxInputGroup className="mb-3">
        <Button type="button" color="secondary" variant="outline">
          Action
        </Button>
        <CxMenu>
          <CxMenuToggle color="secondary" variant="outline">
            <span className="visually-hidden">Toggle menu</span>
          </CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">Action</CxMenuItem>
            <CxMenuItem href="#">Another action</CxMenuItem>
            <CxMenuItem href="#">Something else here</CxMenuItem>
            <CxMenuDivider />
            <CxMenuItem href="#">Separated link</CxMenuItem>
          </CxMenuList>
        </CxMenu>
        <CxTextInput aria-label="Text input with segmented menu button" />
      </CxInputGroup>

      <CxInputGroup>
        <CxTextInput aria-label="Text input with segmented menu button" />
        <Button type="button" color="secondary" variant="outline">
          Action
        </Button>
        <CxMenu placement="bottom-end">
          <CxMenuToggle color="secondary" variant="outline">
            <span className="visually-hidden">Toggle menu</span>
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
