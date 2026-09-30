import { ContextMenu, MenuDivider, MenuItem, MenuList } from '@chassis-ui/react'

export const Example = () => (
  <ContextMenu className="border border-style-dashed rounded p-xl text-center" tabIndex={0}>
    Right-click, long-press, or press Shift+F10 in this area.
    <MenuList>
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
      <MenuDivider />
      <MenuItem>Delete</MenuItem>
    </MenuList>
  </ContextMenu>
)
