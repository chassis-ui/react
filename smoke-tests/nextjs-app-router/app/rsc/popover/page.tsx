import { Button, Popover } from '@chassis-ui/react'
import { Holder } from '../Holder'
import { SlowMark } from '../SlowMark'

export default function Page() {
  return (
    <main>
      <Popover title="Popover title" content="Popover body">
        <Button>
          <Holder icon={SlowMark} /> Popover trigger
        </Button>
      </Popover>
    </main>
  )
}
