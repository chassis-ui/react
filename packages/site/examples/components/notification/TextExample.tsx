import { Notification, NotificationTitle, NotificationText } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification color="success" dismissible>
      <NotificationTitle>A notification with a title</NotificationTitle>
      <NotificationText>
        Wrapping the message in a div sidesteps the browser's default paragraph margin, so no extra
        CSS is needed to keep spacing consistent with the grid gap.
      </NotificationText>
    </Notification>
  )
}
