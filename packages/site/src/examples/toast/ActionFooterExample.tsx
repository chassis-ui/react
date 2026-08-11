import { Button, Toast, ToastBody, ToastFooter, useToast } from '@chassis-ui/react'

const Actions = () => {
  const { close } = useToast()
  return (
    <>
      <Button type="button" color="primary" size="small">
        Take action
      </Button>
      <Button type="button" size="small" onClick={close}>
        Close
      </Button>
    </>
  )
}

export const Example = () => {
  return (
    <Toast autohide={false} visible={true}>
      <ToastBody>Hello, world! This is a toast message.</ToastBody>
      <ToastFooter>
        <Actions />
      </ToastFooter>
    </Toast>
  )
}
