import { Toast, ToastBody, ToastHeader, Toaster } from '@chassis-ui/react'

export const StackingExample = () => {
  return (
    <Toaster>
      <Toast autohide={false} visible={true}>
        <ToastHeader closeButton>
          <svg
            className="rounded me-small"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill="#007aff"></rect>
          </svg>
          <strong className="me-auto">Chassis</strong>
          <small>7 min ago</small>
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </Toast>
      <Toast autohide={false} visible={true}>
        <ToastHeader closeButton>
          <svg
            className="rounded me-small"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill="#007aff"></rect>
          </svg>
          <strong className="me-auto">Chassis</strong>
          <small>7 min ago</small>
        </ToastHeader>
        <ToastBody>Hello, world! This is a toast message.</ToastBody>
      </Toast>
    </Toaster>
  )
}
