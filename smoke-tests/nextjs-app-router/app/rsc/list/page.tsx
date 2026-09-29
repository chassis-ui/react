import Link from 'next/link'
import { List, ListItem } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <List data-testid="with-component">
        <ListItem component="a" href="/rsc/tabs">
          Link item <ClientMark />
        </ListItem>
        <ListItem>Plain item</ListItem>
      </List>
      <List data-testid="with-as-child">
        <ListItem asChild>
          <Link href="/rsc/tabs">
            Router item <ClientMark />
          </Link>
        </ListItem>
        <ListItem>Other item</ListItem>
      </List>
      <List data-testid="plain">
        <ListItem>
          Only item <ClientMark />
        </ListItem>
      </List>
    </main>
  )
}
