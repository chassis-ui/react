import { useState } from 'react'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  useDrawer
} from '@chassis-ui/react'

const Footer = () => {
  const { close } = useDrawer()
  return (
    <DrawerFooter>
      <Button color="primary" onClick={close}>
        Done
      </Button>
    </DrawerFooter>
  )
}

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open drawer</Button>
      <Drawer placement="end" visible={visible} onClose={() => setVisible(false)}>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          The "Done" button below closes this drawer via <code>useDrawer()</code>, not a prop passed
          down from the parent.
        </DrawerBody>
        <Footer />
      </Drawer>
    </>
  )
}
