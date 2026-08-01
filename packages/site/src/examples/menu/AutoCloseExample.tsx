import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="d-flex flex-wrap gap-small">
      <CxMenu autoClose>
        <CxMenuToggle color="secondary">Default</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Copy</CxMenuItem>
          <CxMenuItem href="#">Paste</CxMenuItem>
          <CxMenuItem href="#">Delete</CxMenuItem>
        </CxMenuList>
      </CxMenu>

      <CxMenu autoClose="inside">
        <CxMenuToggle color="secondary">Close inside</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">New file</CxMenuItem>
          <CxMenuItem href="#">Open</CxMenuItem>
          <CxMenuItem href="#">Save</CxMenuItem>
        </CxMenuList>
      </CxMenu>

      <CxMenu autoClose="outside">
        <CxMenuToggle color="secondary">Close outside</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Rename</CxMenuItem>
          <CxMenuItem href="#">Duplicate</CxMenuItem>
          <CxMenuItem href="#">Move to</CxMenuItem>
        </CxMenuList>
      </CxMenu>

      <CxMenu autoClose={false}>
        <CxMenuToggle color="secondary">Manual close</CxMenuToggle>
        <CxMenuList>
          <CxMenuItem href="#">Cut</CxMenuItem>
          <CxMenuItem href="#">Copy</CxMenuItem>
          <CxMenuItem href="#">Paste</CxMenuItem>
        </CxMenuList>
      </CxMenu>
    </div>
  )
}
