import {
  Notification,
  NotificationIcon,
  NotificationTitle,
  NotificationText
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification color="success" dismissible>
      <NotificationIcon name="check-solid" className="align-self-start" />
      <NotificationTitle>A notification with a title</NotificationTitle>
      <NotificationText>
        Body text has no margin — spacing between the title and text comes from the grid gap.
      </NotificationText>
    </Notification>
  )
}
