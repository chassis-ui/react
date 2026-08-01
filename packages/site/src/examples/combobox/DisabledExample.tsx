import { CxCombobox, CxComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxCombobox aria-label="Role" placeholder="Choose a role…">
      <CxComboboxItem id="admin">Admin</CxComboboxItem>
      <CxComboboxItem id="editor" disabled>
        Editor (unavailable)
      </CxComboboxItem>
      <CxComboboxItem id="viewer">Viewer</CxComboboxItem>
    </CxCombobox>
  )
}
