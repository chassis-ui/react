import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const BodyScrollExample = () => {
  const [visibleScrolling, setVisibleScrolling] = useState(false)
  const [visibleScrollBackdrop, setVisibleScrollBackdrop] = useState(false)
  return (
    <>
      <Button color="primary" onClick={() => setVisibleScrolling(true)}>
        Scrolling, no backdrop
      </Button>
      <Button color="primary" onClick={() => setVisibleScrollBackdrop(true)}>
        Scrolling with backdrop
      </Button>
      <Drawer
        backdrop={false}
        placement="start"
        scroll
        visible={visibleScrolling}
        onClose={() => setVisibleScrolling(false)}
      >
        <Drawer.Header>
          <Drawer.Title>Scrolling, no backdrop</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Body scroll is enabled and the backdrop is removed.</p>
        </Drawer.Body>
      </Drawer>
      <Drawer
        placement="start"
        scroll
        visible={visibleScrollBackdrop}
        onClose={() => setVisibleScrollBackdrop(false)}
      >
        <Drawer.Header>
          <Drawer.Title>Scrolling with backdrop</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Body scroll is enabled and the backdrop remains visible.</p>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
