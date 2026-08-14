import { Toast, Icon } from '@chassis-ui/react'

export const Example = () => {
  const icon = <Icon name="info-circle-solid" />
  return (
    <Toast
      animation={false}
      autohide={false}
      visible={true}
      icon={icon}
      title="Chassis"
      time="7 min ago"
      message="Hello, world! This is a toast message."
      closeButton
    />
  )
}
