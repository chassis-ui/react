import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open drawer</Button>
      <Drawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Drawer body content goes here.</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
