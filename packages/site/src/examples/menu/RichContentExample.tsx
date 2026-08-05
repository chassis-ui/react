import { Icon, Menu } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Menu>
      <Menu.Toggle color="secondary">Switch workspace</Menu.Toggle>
      <Menu.List>
        <Menu.Item
          component="button"
          icon={<Icon name="shield-outline" size={16} />}
          description="3 members"
          selected
        >
          Acme Corp
        </Menu.Item>
        <Menu.Item
          component="button"
          icon={<Icon name="users-outline" size={16} />}
          description="12 members"
        >
          Globex Inc
        </Menu.Item>
      </Menu.List>
    </Menu>
  )
}
