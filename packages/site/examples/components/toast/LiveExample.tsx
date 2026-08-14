import { Button, ToastBody, ToastHeader, Toaster, addToast, Icon } from '@chassis-ui/react'

export const Example = () => {
  const icon = <Icon name="info-circle-solid" />
  const handleClick = () => {
    addToast(
      <>
        <ToastHeader icon={icon} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </>
    )
  }
  return (
    <>
      <Button onClick={handleClick}>Send a toast</Button>
      <Toaster placement="bottom-end" />
    </>
  )
}
