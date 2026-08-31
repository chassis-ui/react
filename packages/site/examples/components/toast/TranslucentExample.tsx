import { Toast, ToastBody, ToastHeader, Icon } from '@chassis-ui/react'

export const Example = () => {
  const icon = <Icon name="info-circle-solid" />
  return (
    <Toast translucent autohide={false} visible={true}>
      <ToastHeader icon={icon} time="7 min ago" closeButton>
        Chassis
      </ToastHeader>
      <ToastBody>Hello, world! This is a toast message.</ToastBody>
    </Toast>
  )
}
