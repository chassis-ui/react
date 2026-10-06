import { useState } from 'react'
import { Button, Menu, MenuItem, MenuList, MenuToggle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="d-flex align-items-center gap-sm">
      <Menu visible={visible} onVisibleChange={setVisible}>
        <MenuToggle color="secondary">Actions</MenuToggle>
        <MenuList>
          <MenuItem href="#">Rename</MenuItem>
          <MenuItem href="#">Duplicate</MenuItem>
          <MenuItem href="#">Move to</MenuItem>
        </MenuList>
      </Menu>
      <Button variant="outline" onClick={() => setVisible(true)}>
        Open from here
      </Button>
      <span className="form-help">Menu is {visible ? 'open' : 'closed'}.</span>
    </div>
  )
}
