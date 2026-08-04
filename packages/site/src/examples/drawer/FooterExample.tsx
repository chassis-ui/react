import { useState } from 'react'
import { Button, Drawer } from '@chassis-ui/react'

export const FooterExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open drawer</Button>
      <Drawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <Drawer.Header>
          <Drawer.Title>Drawer with stacked actions</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>A drawer with multiple footer actions, stacking full-width at the small breakpoint.</p>
        </Drawer.Body>
        <Drawer.Footer stacked>
          <Button color="primary">Take action</Button>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}
