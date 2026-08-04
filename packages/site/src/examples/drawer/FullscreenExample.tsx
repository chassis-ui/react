import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const FullscreenExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Fullscreen</Button>
      <Drawer fullscreen placement="bottom" visible={visible} onClose={() => setVisible(false)}>
        <Drawer.Header>
          <Drawer.Title>Fullscreen drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Fills the full viewport inset area.</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
