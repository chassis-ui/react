import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const AppearanceExample = () => {
  const [visibleSheet, setVisibleSheet] = useState(false)
  const [visibleTranslucent, setVisibleTranslucent] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleSheet(true)}>Sheet</Button>
      <Button onClick={() => setVisibleTranslucent(true)}>Translucent</Button>
      <Drawer
        sheet
        placement="start"
        visible={visibleSheet}
        onClose={() => setVisibleSheet(false)}
      >
        <Drawer.Header>
          <Drawer.Title>Sheet drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Flush against the viewport edge — no inset, rounding, or border.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button color="neutral" onClick={() => setVisibleSheet(false)}>
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
      <Drawer
        translucent
        placement="start"
        visible={visibleTranslucent}
        onClose={() => setVisibleTranslucent(false)}
      >
        <Drawer.Header>
          <Drawer.Title>Translucent drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>Frosted-glass background over the page content.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button color="neutral" onClick={() => setVisibleTranslucent(false)}>
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}
