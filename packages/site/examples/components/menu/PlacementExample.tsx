import { Menu, MenuToggle, MenuList, MenuItem } from '@chassis-ui/react'

const placements = ['top', 'bottom', 'left', 'right'] as const

export const Example = () => {
  return (
    <div className="d-flex flex-wrap gap-small">
      {placements.map((placement) => (
        <Menu key={placement} placement={placement}>
          <MenuToggle color="secondary">{placement}</MenuToggle>
          <MenuList>
            <MenuItem href="#">Action</MenuItem>
            <MenuItem href="#">Another action</MenuItem>
            <MenuItem href="#">Something else here</MenuItem>
          </MenuList>
        </Menu>
      ))}
    </div>
  )
}
