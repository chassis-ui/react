import { Notification } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <Notification dismissible title="Notification title" text="Notification text">
        <ClientMark />
      </Notification>
    </main>
  )
}
