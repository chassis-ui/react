import { CloseButton, Toast, ToastBody, useToast } from '@chassis-ui/react'

const Body = () => {
  const { close } = useToast()
  return (
    <div className="d-flex">
      <ToastBody>Hello, world! This is a toast message.</ToastBody>
      <CloseButton className="ms-auto m-small" onClick={close} />
    </div>
  )
}

export const Example = () => {
  return (
    <Toast autohide={false} visible={true}>
      <Body />
    </Toast>
  )
}
