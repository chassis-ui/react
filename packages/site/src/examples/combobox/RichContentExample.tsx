import { CxCombobox, CxComboboxItem, Icon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxCombobox aria-label="Role" placeholder="Choose a role…">
      <CxComboboxItem
        id="admin"
        icon={<Icon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </CxComboboxItem>
      <CxComboboxItem
        id="editor"
        icon={<Icon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </CxComboboxItem>
      <CxComboboxItem
        id="viewer"
        icon={<Icon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </CxComboboxItem>
    </CxCombobox>
  )
}
