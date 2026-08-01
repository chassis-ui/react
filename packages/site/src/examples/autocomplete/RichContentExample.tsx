import { CxAutocomplete, CxAutocompleteItem, CxIcon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAutocomplete aria-label="Role" placeholder="Choose a role…">
      <CxAutocompleteItem
        id="admin"
        icon={<CxIcon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </CxAutocompleteItem>
      <CxAutocompleteItem
        id="editor"
        icon={<CxIcon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </CxAutocompleteItem>
      <CxAutocompleteItem
        id="viewer"
        icon={<CxIcon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </CxAutocompleteItem>
    </CxAutocomplete>
  )
}
