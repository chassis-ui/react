import { useState } from 'react'
import { Button, ContextMenu, MenuItem, MenuList } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="d-flex flex-column gap-sm">
      <ContextMenu
        className="border border-style-dashed rounded p-xl text-center"
        tabIndex={0}
        visible={visible}
        onVisibleChange={setVisible}
      >
        Right-click in this area.
        <MenuList>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Move to</MenuItem>
        </MenuList>
      </ContextMenu>
      <div className="d-flex align-items-center gap-sm">
        <Button variant="outline" onClick={() => setVisible(false)}>
          Close from here
        </Button>
        <span>The menu is {visible ? 'open' : 'closed'}.</span>
      </div>
    </div>
  )
}
