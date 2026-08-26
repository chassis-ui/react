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
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open drawer</Button>
      <Drawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>Drawer with stacked actions</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>A drawer with multiple footer actions, stacking full-width at the small breakpoint.</p>
        </DrawerBody>
        <DrawerFooter stacked>
          <Button color="primary">Take action</Button>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
        </DrawerFooter>
      </Drawer>
    </>
  )
}
