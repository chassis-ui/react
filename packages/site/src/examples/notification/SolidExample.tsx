import { Notification } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Notification solid color="primary">
        A simple primary notification—check it out!
      </Notification>
      <Notification solid color="secondary">
        A simple secondary notification—check it out!
      </Notification>
      <Notification solid color="success">
        A simple success notification—check it out!
      </Notification>
      <Notification solid color="danger">
        A simple danger notification—check it out!
      </Notification>
      <Notification solid color="warning">
        A simple warning notification—check it out!
      </Notification>
      <Notification solid color="info">
        A simple info notification—check it out!
      </Notification>
    </>
  )
}
