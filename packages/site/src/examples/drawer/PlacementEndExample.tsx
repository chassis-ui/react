import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const PlacementEndExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>End</Button>
      <Drawer placement="end" visible={visible} onClose={() => setVisible(false)}>
        <Drawer.Header>
          <Drawer.Title>End drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Slides in from the right (LTR).</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
