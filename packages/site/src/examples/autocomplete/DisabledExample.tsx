import { CxAutocomplete, CxAutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAutocomplete aria-label="Role" placeholder="Choose a role…">
      <CxAutocompleteItem id="admin">Admin</CxAutocompleteItem>
      <CxAutocompleteItem id="editor" disabled>
        Editor (unavailable)
      </CxAutocompleteItem>
      <CxAutocompleteItem id="viewer">Viewer</CxAutocompleteItem>
    </CxAutocomplete>
  )
}
