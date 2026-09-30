import { Toast, ToastBody, ToastHeader, Toaster, Icon } from '@chassis-ui/react'

export const Example = () => {
  const icon = <Icon name="info-circle-solid" />
  return (
    <Toaster>
      <Toast autohide={false} defaultVisible>
        <ToastHeader icon={icon} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </Toast>
      <Toast autohide={false} defaultVisible>
        <ToastHeader icon={icon} time="7 min ago" closeButton>
          Chassis
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </Toast>
    </Toaster>
  )
}
