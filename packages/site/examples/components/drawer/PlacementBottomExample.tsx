import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Bottom</Button>
      <Drawer placement="bottom" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>Bottom drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Slides up from the bottom.</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
