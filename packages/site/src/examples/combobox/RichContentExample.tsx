import { Combobox, Icon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Role" placeholder="Choose a role…">
      <Combobox.Item
        id="admin"
        icon={<Icon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </Combobox.Item>
      <Combobox.Item
        id="editor"
        icon={<Icon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </Combobox.Item>
      <Combobox.Item
        id="viewer"
        icon={<Icon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </Combobox.Item>
    </Combobox>
  )
}
