import { Avatar } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Avatar src="https://i.pravatar.cc/256" status="success" statusLabel="Online" />
      <Avatar src="https://i.pravatar.cc/256" status="danger" statusLabel="Offline" />
      <Avatar src="https://i.pravatar.cc/256" status="warning" statusLabel="Away" />
      <Avatar src="https://i.pravatar.cc/256" status="neutral" statusLabel="Busy" />
    </>
  )
}
