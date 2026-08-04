import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const PlacementStartExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Start</Button>
      <Drawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <Drawer.Header>
          <Drawer.Title>Start drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Slides in from the left (LTR).</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
