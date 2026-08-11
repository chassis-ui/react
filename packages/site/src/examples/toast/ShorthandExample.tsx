import { Toast } from '@chassis-ui/react'

const logo = (
  <svg
    className="rounded me-xsmall"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    focusable="false"
    role="img"
  >
    <rect width="100%" height="100%" fill="#007aff"></rect>
  </svg>
)

export const Example = () => {
  return (
    <Toast
      animation={false}
      autohide={false}
      visible={true}
      image={logo}
      title="Chassis"
      time="7 min ago"
      message="Hello, world! This is a toast message."
      closeButton
    />
  )
}
