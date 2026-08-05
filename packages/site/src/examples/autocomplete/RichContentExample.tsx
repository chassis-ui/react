import { Autocomplete, Icon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Role" placeholder="Choose a role…">
      <Autocomplete.Item
        id="admin"
        icon={<Icon name="shield-outline" size={16} />}
        description="Full access to every setting"
      >
        Admin
      </Autocomplete.Item>
      <Autocomplete.Item
        id="editor"
        icon={<Icon name="gear-outline" size={16} />}
        description="Can edit content, not settings"
      >
        Editor
      </Autocomplete.Item>
      <Autocomplete.Item
        id="viewer"
        icon={<Icon name="eye-outline" size={16} />}
        description="Read-only access"
      >
        Viewer
      </Autocomplete.Item>
    </Autocomplete>
  )
}
