import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Top</Button>
      <Drawer placement="top" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>Top drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Slides down from the top.</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
