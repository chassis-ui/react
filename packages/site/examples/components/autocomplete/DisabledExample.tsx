import { Autocomplete, AutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Role" placeholder="Choose a role…">
      <AutocompleteItem id="admin">Admin</AutocompleteItem>
      <AutocompleteItem id="editor" disabled>
        Editor (unavailable)
      </AutocompleteItem>
      <AutocompleteItem id="viewer">Viewer</AutocompleteItem>
    </Autocomplete>
  )
}
