import { Toast } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <Toast
        defaultVisible
        autohide={false}
        closeButton
        title="Toast title"
        message="Toast message"
      >
        <ClientMark />
      </Toast>
    </main>
  )
}
