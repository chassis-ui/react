import { Toast, ToastBody, ToastClose } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Toast autohide={false} visible={true} color="primary" solid className="align-items-center">
      <div className="d-flex">
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
        <ToastClose className="me-small m-auto" />
      </div>
    </Toast>
  )
}
