import { Button, Toast, ToastBody } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Toast
      autohide={false}
      defaultVisible
      footer={(close) => (
        <>
          <Button type="button" color="primary" size="sm">
            Take action
          </Button>
          <Button type="button" size="sm" onClick={close}>
            Close
          </Button>
        </>
      )}
    >
      <ToastBody>Hello, world! This is a toast message.</ToastBody>
    </Toast>
  )
}
