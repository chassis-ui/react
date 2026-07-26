import {
  CxButton,
  CxFormInput,
  CxInputGroup,
  CxMenu,
  CxMenuDivider,
  CxMenuItem,
  CxMenuList,
  CxMenuToggle
} from '@chassis-ui/react'

export const SegmentedButtonsExample = () => {
  return (
    <>
      <CxInputGroup className="mb-3">
        <CxButton type="button" context="secondary" variant="outline">
          Action
        </CxButton>
        <CxMenu>
          <CxMenuToggle context="secondary" variant="outline">
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
        <CxFormInput aria-label="Text input with segmented menu button" />
      </CxInputGroup>

      <CxInputGroup>
        <CxFormInput aria-label="Text input with segmented menu button" />
        <CxButton type="button" context="secondary" variant="outline">
          Action
        </CxButton>
        <CxMenu placement="bottom-end">
          <CxMenuToggle context="secondary" variant="outline">
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
