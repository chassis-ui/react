import { CxCombobox, CxComboboxItem, CxIcon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxCombobox aria-label="Role" placeholder="Choose a role…">
      <CxComboboxItem
        id="admin"
        icon={<CxIcon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </CxComboboxItem>
      <CxComboboxItem
        id="editor"
        icon={<CxIcon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </CxComboboxItem>
      <CxComboboxItem
        id="viewer"
        icon={<CxIcon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </CxComboboxItem>
    </CxCombobox>
  )
}
