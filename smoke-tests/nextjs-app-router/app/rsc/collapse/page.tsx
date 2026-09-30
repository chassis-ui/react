import { Collapse } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <Collapse visible>
        Collapse content <ClientMark />
      </Collapse>
    </main>
  )
}
