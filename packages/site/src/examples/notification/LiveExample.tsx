import { useState } from 'react'
import { Notification, Button } from '@chassis-ui/react'

export const LiveExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Notification color="primary" dismissible visible={visible} onClose={() => setVisible(false)}>
        A simple primary notification—check it out!
      </Notification>
      <Button color="primary" onClick={() => setVisible(true)}>
        Show live notification
      </Button>
    </>
  )
}
