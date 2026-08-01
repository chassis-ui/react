import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div data-cx-theme="dark">
      <CxMenu>
        <CxMenuToggle color="secondary">Toggle menu</CxMenuToggle>
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
