import { Autocomplete, Icon, AutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Role" placeholder="Choose a role…">
      <AutocompleteItem
        id="admin"
        icon={<Icon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </AutocompleteItem>
      <AutocompleteItem
        id="editor"
        icon={<Icon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </AutocompleteItem>
      <AutocompleteItem
        id="viewer"
        icon={<Icon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </AutocompleteItem>
    </Autocomplete>
  )
}
