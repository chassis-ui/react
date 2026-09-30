import {
  ContextMenu,
  Icon,
  MenuDivider,
  MenuHeader,
  MenuItem,
  MenuList,
  MenuSubmenu
} from '@chassis-ui/react'

export const Example = () => (
  <ContextMenu className="border border-style-dashed rounded p-xl text-center" tabIndex={0}>
    Report.pdf
    <MenuList aria-label="Actions for Report.pdf">
      <MenuHeader>Report.pdf</MenuHeader>
      <MenuItem icon={<Icon name="eye-outline" size={16} />} description="Read-only">
        Open
      </MenuItem>
      <MenuItem icon={<Icon name="gear-outline" size={16} />}>Properties</MenuItem>
      <MenuSubmenu trigger="Share">
        <MenuItem icon={<Icon name="users-outline" size={16} />}>With the team</MenuItem>
        <MenuItem>Copy link</MenuItem>
      </MenuSubmenu>
      <MenuDivider />
      <MenuItem disabled>Rename</MenuItem>
      <MenuItem>Delete</MenuItem>
    </MenuList>
  </ContextMenu>
)
