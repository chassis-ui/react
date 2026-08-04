import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const PlacementBottomExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Bottom</Button>
      <Drawer placement="bottom" visible={visible} onClose={() => setVisible(false)}>
        <Drawer.Header>
          <Drawer.Title>Bottom drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Slides up from the bottom.</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
