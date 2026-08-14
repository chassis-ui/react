import { Notification } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification color="info" icon="info-circle-solid" autohide>
      This notification dismisses itself after 5 seconds — hover or focus it to pause the timer.
    </Notification>
  )
}
