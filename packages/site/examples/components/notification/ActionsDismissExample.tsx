import { Button, Notification, useNotification } from '@chassis-ui/react'

const Actions = () => {
  const { close } = useNotification()
  return (
    <div className="hstack gap-sm align-items-center justify-content-end">
      <Button color="primary" size="sm">
        Take Action
      </Button>
      <Button variant="outline" size="sm" onClick={close}>
        Dismiss
      </Button>
    </div>
  )
}

export const Example = () => {
  return (
    <Notification color="primary">
      <p className="m-0">A notification dismissed by a normal button, not the close icon.</p>
      <Actions />
    </Notification>
  )
}
