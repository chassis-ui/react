// Deliberately no 'use client' here -- this file is a React Server Component. It imports
// @chassis-ui/react components straight from a Server Component to prove the package's own
// 'use client' directive (packages/react/src/index.ts, see ../../../packages/react/RSC.md)
// establishes the client boundary on its own -- a consumer doesn't need to wrap usage in their
// own client component. If a demo ever needs local state/effects, that belongs in a separate
// consumer-authored Client Component with its own explicit 'use client', not here -- adding one
// to this file would stop this page from proving anything about the package's own directive.
//
// Covers: a plain hook-using component (Button), a react-aria-stateful one (Switch), a compound
// family (Card/CardHeader/CardBody), a layout primitive (Flex), and a polymorphic forwardRef one
// (Avatar). Not exhaustive, just enough surface area to catch a real "doesn't build against this
// framework" regression. Deliberately skips Tooltip/Popover/Toast/Notification/Collapse/Tabs --
// anything built on react-transition-group -- it throws "Element type is invalid" under `next
// dev` here. Root-caused: it's a Turbopack DEV-ONLY bug, not a build or production issue -- a
// `next build` + `next start` of this same app renders Tooltip correctly with zero errors, so
// `next build` (what CI runs) can't catch it either way. react-transition-group ships a legacy
// dual-package shape (separate `main`/`module` fields, no `exports` map); Turbopack's dev bundler
// has documented bugs resolving that shape to two different module instances within one render
// graph (vercel/next.js#91411) and around workspace-symlinked deps generally (#77562, #91896) --
// this hits both. Not fixable from this package; consumers running `next dev` on Turbopack would
// hit the same wall with Tooltip/Popover/Toast/Notification/Collapse/Tabs today.
import { Avatar, Badge, Button, Card, CardBody, CardHeader, CardTitle, Flex, Switch } from '@chassis-ui/react'

export default function Home() {
  return (
    <main className="p-3xlarge">
      <Flex direction="column" gap="xlarge">
        <div>
          <h1>@chassis-ui/react Next.js App Router smoke test</h1>
          <p>See AGENTS.md in this directory -- not a real app.</p>
        </div>

        <Flex wrap="wrap" align="center" gap="large">
          <Badge color="primary">server-rendered badge</Badge>
          <Button>hook-using button (forwardRef)</Button>
          <Switch defaultSelected label="hook-using switch (react-aria useToggleState)" />
          <Avatar alt="polymorphic forwardRef avatar">CX</Avatar>
        </Flex>

        <Card>
          <CardHeader>
            <CardTitle>compound family</CardTitle>
          </CardHeader>
          <CardBody>Card / CardHeader / CardTitle / CardBody, composed as a consumer would.</CardBody>
        </Card>
      </Flex>
    </main>
  )
}
