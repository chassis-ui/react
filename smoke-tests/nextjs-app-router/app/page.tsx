// Deliberately no 'use client' here -- this file is a React Server Component. It imports
// @chassis-ui/react components straight from a Server Component to prove the package's own
// 'use client' directive (packages/react/src/index.ts, see ../../../packages/react/RSC.md)
// establishes the client boundary on its own -- a consumer doesn't need to wrap usage in their
// own client component. Covers a plain hook-using component (Button), a react-aria-stateful one
// (Switch), and a compound family (Card/CardBody) -- not exhaustive, just enough surface area to
// catch a real "doesn't build against this framework" regression.
import { Badge, Button, Card, CardBody, Switch } from '@chassis-ui/react'

export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>@chassis-ui/react Next.js App Router smoke test</h1>
      <p>See AGENTS.md in this directory -- not a real app.</p>
      <Badge>server-rendered badge</Badge>
      <Button>hook-using button (forwardRef)</Button>
      <Switch defaultSelected>hook-using switch (react-aria useToggleState)</Switch>
      <Card>
        <CardBody>compound family (Card/CardBody)</CardBody>
      </Card>
    </main>
  )
}
