import { Button, NotificationStack, NotificationTitle, addNotification } from '@chassis-ui/react'

export const Example = () => {
  const handleSave = () => {
    addNotification(
      <>
        <NotificationTitle>Saved!</NotificationTitle>
        Your changes have been saved successfully.
      </>,
      { color: 'success', dismissible: true }
    )
  }

  return (
    <>
      <Button color="primary" onClick={handleSave}>
        Save changes
      </Button>
      <NotificationStack aria-label="Notifications" className="mt-medium" />
    </>
  )
}
