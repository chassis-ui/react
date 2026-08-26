import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>End</Button>
      <Drawer placement="end" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>End drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Slides in from the right (LTR).</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
