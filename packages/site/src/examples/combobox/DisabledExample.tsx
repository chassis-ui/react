import { Combobox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Role" placeholder="Choose a role…">
      <Combobox.Item id="admin">Admin</Combobox.Item>
      <Combobox.Item id="editor" disabled>
        Editor (unavailable)
      </Combobox.Item>
      <Combobox.Item id="viewer">Viewer</Combobox.Item>
    </Combobox>
  )
}
