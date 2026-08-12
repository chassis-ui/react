import { Toast, ToastBody } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Toast autohide={false} visible={true}>
      Hello, world! This is a toast message.
    </Toast>
  )
}
