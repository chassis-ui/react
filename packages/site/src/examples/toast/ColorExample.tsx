import { CloseButton, Toast, ToastBody, useToast } from '@chassis-ui/react'

const Body = () => {
  const { close } = useToast()
  return (
    <div className="d-flex">
      <ToastBody>Hello, world! This is a toast message.</ToastBody>
      <CloseButton className="me-small m-auto" onClick={close} />
    </div>
  )
}

export const Example = () => {
  return (
    <Toast autohide={false} visible={true} color="primary" solid>
      <Body />
    </Toast>
  )
}
