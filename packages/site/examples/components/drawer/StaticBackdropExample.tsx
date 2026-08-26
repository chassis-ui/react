import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Static backdrop</Button>
      <Drawer
        backdrop="static"
        placement="start"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <DrawerHeader>
          <DrawerTitle>Static backdrop</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Clicking outside nudges this drawer rather than closing it.</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
