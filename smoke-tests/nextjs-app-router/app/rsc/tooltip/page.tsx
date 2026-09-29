import { Button, Tooltip } from '@chassis-ui/react'
import { Holder } from '../Holder'
import { SlowMark } from '../SlowMark'

export default function Page() {
  return (
    <main>
      <Tooltip content="Tip text">
        <Button>
          <Holder icon={SlowMark} /> Tooltip trigger
        </Button>
      </Tooltip>
    </main>
  )
}
