import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Fullscreen</Button>
      <Drawer fullscreen placement="bottom" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>Fullscreen drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Fills the full viewport inset area.</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
