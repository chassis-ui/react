import { Icon, CxMenu, CxMenuItem, CxMenuList, CxMenuToggle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxMenu>
      <CxMenuToggle color="secondary">Switch workspace</CxMenuToggle>
      <CxMenuList>
        <CxMenuItem
          component="button"
          icon={<Icon name="shield-outline" size={16} />}
          description="3 members"
          selected
        >
          Acme Corp
        </CxMenuItem>
        <CxMenuItem
          component="button"
          icon={<Icon name="users-outline" size={16} />}
          description="12 members"
        >
          Globex Inc
        </CxMenuItem>
      </CxMenuList>
    </CxMenu>
  )
}
