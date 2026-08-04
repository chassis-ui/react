import { CxAutocomplete, CxAutocompleteItem, Icon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAutocomplete aria-label="Role" placeholder="Choose a role…">
      <CxAutocompleteItem
        id="admin"
        icon={<Icon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </CxAutocompleteItem>
      <CxAutocompleteItem
        id="editor"
        icon={<Icon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </CxAutocompleteItem>
      <CxAutocompleteItem
        id="viewer"
        icon={<Icon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </CxAutocompleteItem>
    </CxAutocomplete>
  )
}
