import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const PlacementTopExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Top</Button>
      <Drawer placement="top" visible={visible} onClose={() => setVisible(false)}>
        <Drawer.Header>
          <Drawer.Title>Top drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Slides down from the top.</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
