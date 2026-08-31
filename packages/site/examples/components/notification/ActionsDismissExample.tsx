import { Button, Notification, useNotification } from '@chassis-ui/react'

const Actions = () => {
  const { close } = useNotification()
  return (
    <div className="hstack gap-small align-items-center justify-content-end">
      <Button color="primary" size="small">
        Take Action
      </Button>
      <Button variant="outline" size="small" onClick={close}>
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
