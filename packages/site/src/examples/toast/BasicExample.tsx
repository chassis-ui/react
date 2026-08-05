import { Button, ToastBody, ToastHeader, Toaster, addToast } from '@chassis-ui/react'

export const BasicExample = () => {
  const handleClick = () => {
    addToast(
      <>
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
