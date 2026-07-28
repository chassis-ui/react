import { CxAvatar } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxAvatar src="https://i.pravatar.cc/256" status="success" statusLabel="Online" />
      <CxAvatar src="https://i.pravatar.cc/256" status="danger" statusLabel="Offline" />
      <CxAvatar src="https://i.pravatar.cc/256" status="warning" statusLabel="Away" />
      <CxAvatar src="https://i.pravatar.cc/256" status="neutral" statusLabel="Busy" />
    </>
  )
}
