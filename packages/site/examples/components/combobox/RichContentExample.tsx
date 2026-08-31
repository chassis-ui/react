import { Combobox, Icon, ComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Role" placeholder="Choose a role…">
      <ComboboxItem
        id="admin"
        icon={<Icon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </ComboboxItem>
      <ComboboxItem
        id="editor"
        icon={<Icon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </ComboboxItem>
      <ComboboxItem
        id="viewer"
        icon={<Icon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </ComboboxItem>
    </Combobox>
  )
}
