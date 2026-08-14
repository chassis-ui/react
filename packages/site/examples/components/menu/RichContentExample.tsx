import { Icon, Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <MenuToggle color="secondary">Switch workspace</MenuToggle>
      <MenuList>
        <MenuItem
          component="button"
          icon={<Icon name="shield-outline" size={16} />}
          description="3 members"
          selected
        >
          Acme Corp
        </MenuItem>
        <MenuItem
          component="button"
          icon={<Icon name="users-outline" size={16} />}
          description="12 members"
        >
          Globex Inc
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
