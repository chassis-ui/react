import { Notification, NotificationIcon, NotificationTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification color="success" dismissible>
      <NotificationIcon name="check-solid" className="align-self-start" />
      <NotificationTitle>A notification with a title</NotificationTitle>
      <p>
        Body paragraphs have no margin — spacing between the title and paragraphs comes from the
        grid gap.
      </p>
    </Notification>
  )
}
