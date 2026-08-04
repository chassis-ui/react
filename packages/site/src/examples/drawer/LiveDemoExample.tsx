import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const LiveDemoExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open drawer</Button>
      <Drawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <Drawer.Header>
          <Drawer.Title>Drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Drawer body content goes here.</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
