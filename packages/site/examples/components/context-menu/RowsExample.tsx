import { ContextMenu, MenuDivider, MenuItem, MenuList } from '@chassis-ui/react'

const files = ['Report.pdf', 'Budget.xlsx', 'Notes.md']

export const Example = () => (
  <ul className="list">
    {files.map((file) => (
      <ContextMenu key={file} component="li" className="list-item" tabIndex={0}>
        {file}
        <MenuList aria-label={`Actions for ${file}`}>
          <MenuItem>Open</MenuItem>
          <MenuItem>Rename</MenuItem>
          <MenuDivider />
          <MenuItem>Delete</MenuItem>
        </MenuList>
      </ContextMenu>
    ))}
  </ul>
)
