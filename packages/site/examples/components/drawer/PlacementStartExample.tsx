import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Start</Button>
      <Drawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>Start drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Slides in from the left (LTR).</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
