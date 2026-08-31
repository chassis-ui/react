import { useState } from 'react'
import { Button, Toast, ToastBody, ToastHeader, useToast } from '@chassis-ui/react'

const Body = () => {
  const { close } = useToast()
  return (
    <ToastBody>
      File deleted.{' '}
      <Button variant="link" className="p-0" onClick={close}>
        Undo
      </Button>
    </ToastBody>
  )
}

export const Example = () => {
  const [visible, setVisible] = useState(true)
  return (
    <Toast visible={visible} onClose={() => setVisible(false)} autohide={false}>
      <ToastHeader closeButton>Chassis</ToastHeader>
      <Body />
    </Toast>
  )
}
