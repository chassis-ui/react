import { Button, Toast, ToastBody, ToastClose, ToastFooter } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Toast autohide={false} visible={true}>
      <ToastBody>Hello, world! This is a toast message.</ToastBody>
      <ToastFooter>
        <Button type="button" color="primary" size="small">
          Take action
        </Button>
        <ToastClose component={Button}>Close</ToastClose>
      </ToastFooter>
    </Toast>
  )
}
