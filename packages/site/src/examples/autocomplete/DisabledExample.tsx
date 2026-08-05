import { Autocomplete } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Role" placeholder="Choose a role…">
      <Autocomplete.Item id="admin">Admin</Autocomplete.Item>
      <Autocomplete.Item id="editor" disabled>
        Editor (unavailable)
      </Autocomplete.Item>
      <Autocomplete.Item id="viewer">Viewer</Autocomplete.Item>
    </Autocomplete>
  )
}
