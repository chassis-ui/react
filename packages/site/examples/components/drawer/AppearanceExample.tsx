import { useState } from 'react'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@chassis-ui/react'

export const Example = () => {
  const [visibleSheet, setVisibleSheet] = useState(false)
  const [visibleTranslucent, setVisibleTranslucent] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleSheet(true)}>Sheet</Button>
      <Button onClick={() => setVisibleTranslucent(true)}>Translucent</Button>
      <Drawer sheet placement="start" visible={visibleSheet} onClose={() => setVisibleSheet(false)}>
        <DrawerHeader>
          <DrawerTitle>Sheet drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Flush against the viewport edge — no inset, rounding, or border.</p>
        </DrawerBody>
        <DrawerFooter>
          <Button color="neutral" onClick={() => setVisibleSheet(false)}>
            Close
          </Button>
        </DrawerFooter>
      </Drawer>
      <Drawer
        translucent
        placement="start"
        visible={visibleTranslucent}
        onClose={() => setVisibleTranslucent(false)}
      >
        <DrawerHeader>
          <DrawerTitle>Translucent drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Frosted-glass background over the page content.</p>
        </DrawerBody>
        <DrawerFooter>
          <Button color="neutral" onClick={() => setVisibleTranslucent(false)}>
            Close
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}
