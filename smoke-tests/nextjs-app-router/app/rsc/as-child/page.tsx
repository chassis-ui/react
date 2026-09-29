import Link from 'next/link'
import { Button } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'
import { Holder } from '../Holder'
import { SlowMark } from '../SlowMark'

export default function Page() {
  return (
    <main>
      <Button asChild variant="link">
        <a href="/feed.xml" aria-label="Feed">
          <Holder icon={SlowMark} />
        </a>
      </Button>
      <Button asChild disabled>
        <Link href="/rsc/list" aria-label="Disabled link">
          <ClientMark />
        </Link>
      </Button>
    </main>
  )
}
