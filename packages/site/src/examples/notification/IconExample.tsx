import { Notification, NotificationIcon, NotificationText } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Notification color="info">
        <NotificationIcon name="info-circle-solid" />
        <NotificationText>
          An example notification with an icon and <a href="#">a link</a>.
        </NotificationText>
      </Notification>

      <Notification color="info" solid>
        <NotificationIcon name="info-circle-solid" />
        <NotificationText>
          An example notification with an icon and <a href="#">a link</a>.
        </NotificationText>
      </Notification>
    </>
  )
}
