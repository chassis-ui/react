import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const StaticBackdropExample = () => {
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
        <Drawer.Header>
          <Drawer.Title>Static backdrop</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Clicking outside nudges this drawer rather than closing it.</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
