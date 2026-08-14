import { Notification } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification
      color="success"
      icon="check-solid"
      title="Well done!"
      text="Aww yeah, you successfully read this important notification message."
      dismissible
    />
  )
}
