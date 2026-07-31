import { useState } from 'react'
import { CxNotification, CxButton } from '@chassis-ui/react'

export const LiveExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxNotification
        color="primary"
        dismissible
        visible={visible}
        onClose={() => setVisible(false)}
      >
        A simple primary notification—check it out!
      </CxNotification>
      <CxButton color="primary" onClick={() => setVisible(true)}>
        Show live notification
      </CxButton>
    </>
  )
}
