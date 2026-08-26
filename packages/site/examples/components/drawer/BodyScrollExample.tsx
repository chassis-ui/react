import { useState } from 'react'
import { Button, Drawer, DrawerBody, DrawerHeader, DrawerTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visibleScrolling, setVisibleScrolling] = useState(false)
  const [visibleScrollBackdrop, setVisibleScrollBackdrop] = useState(false)
  return (
    <>
      <Button color="primary" onClick={() => setVisibleScrolling(true)}>
        Scrolling, no backdrop
      </Button>
      <Button color="primary" onClick={() => setVisibleScrollBackdrop(true)}>
        Scrolling with backdrop
      </Button>
      <Drawer
        backdrop={false}
        placement="start"
        scroll
        visible={visibleScrolling}
        onClose={() => setVisibleScrolling(false)}
      >
        <DrawerHeader>
          <DrawerTitle>Scrolling, no backdrop</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Body scroll is enabled and the backdrop is removed.</p>
        </DrawerBody>
      </Drawer>
      <Drawer
        placement="start"
        scroll
        visible={visibleScrollBackdrop}
        onClose={() => setVisibleScrollBackdrop(false)}
      >
        <DrawerHeader>
          <DrawerTitle>Scrolling with backdrop</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Body scroll is enabled and the backdrop remains visible.</p>
        </DrawerBody>
      </Drawer>
    </>
  )
}
