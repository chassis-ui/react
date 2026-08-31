import { Toast, ToastBody } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Toast autohide={false} visible={true} color="primary" solid>
      <ToastBody closeButton>Hello, world! This is a toast message.</ToastBody>
    </Toast>
  )
}
