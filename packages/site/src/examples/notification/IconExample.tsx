import { Notification, NotificationIcon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Notification color="info">
        <NotificationIcon name="info-circle-solid" />
        <p>
          An example notification with an icon and <a href="#">a link</a>.
        </p>
      </Notification>

      <Notification color="info" solid>
        <NotificationIcon name="info-circle-solid" />
        <p>
          An example notification with an icon and <a href="#">a link</a>.
        </p>
      </Notification>
    </>
  )
}
