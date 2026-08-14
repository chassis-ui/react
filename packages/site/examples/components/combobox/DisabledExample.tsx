import { Combobox, ComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Role" placeholder="Choose a role…">
      <ComboboxItem id="admin">Admin</ComboboxItem>
      <ComboboxItem id="editor" disabled>
        Editor (unavailable)
      </ComboboxItem>
      <ComboboxItem id="viewer">Viewer</ComboboxItem>
    </Combobox>
  )
}
