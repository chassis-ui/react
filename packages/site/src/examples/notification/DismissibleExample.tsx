import { Notification } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Notification
      color="warning"
      dismissible
      onClose={() => {
        alert('Dismissed!')
      }}
    >
      <strong>Go right ahead</strong> and click that dismiss button over there on the right.
    </Notification>
  )
}
