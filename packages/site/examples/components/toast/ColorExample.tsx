import { Toast, ToastBody } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Toast autohide={false} defaultVisible color="primary" solid>
      <ToastBody closeButton>Hello, world! This is a toast message.</ToastBody>
    </Toast>
  )
}
