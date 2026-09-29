# `smoke-test-nextjs-app-router`

Not a real app — a framework integration smoke test for `@chassis-ui/react`. Its only job is to
prove the package actually installs and builds cleanly inside a real Next.js App Router
application, via a real `next build`, not a synthetic `renderToString` unit test.

`app/page.tsx` is a Server Component (no local `'use client'`) importing components straight from
`@chassis-ui/react` — see [`../../packages/react/RSC.md`](../../packages/react/RSC.md) for why that
works without a consumer-side directive.

```bash
pnpm smoke:build   # from the repo root: builds the library first, then this app
pnpm smoke:test    # the same, then loads the routes below in a browser. CI runs both
```

## Server Component routes

Each route under `app/rsc/` is a Server Component that composes library components directly, with
a client component of the app's own somewhere in what it passes them. `tests/rsc.spec.ts` loads
each one in Chromium, checks the markup the server sent and the page after hydration, and fails on
any console error, warning or uncaught exception.

A build can't stand in for that. What a Server Component passes a client component isn't what a
client component passes another:

- An element whose type is a client component carries a lazy wrapper as its `type`. A check like
  `child.type === ListItem` fails for it, in production too, and fails silently: the routes built,
  and `List` rendered `<ul><a>`.
- An element whose props hold something still loading arrives as a lazy node, which isn't an
  element at all (#37). `SlowMark.tsx` and `Holder.tsx` put an element in that state: a client
  component passed by reference, from a module that takes 300 ms to load. Only `next dev` has the
  browser still loading a module while React reads the payload, so the tests run against
  `next dev` as well as `next start`.

`Table` has no route. It reads its children as a collection and is a Client Component, so a
Server Component renders `StaticTable` instead (#20), which has one.

`private: true`, excluded from Changesets (`.changeset/config.json`'s `ignore`) and from the root
`pnpm lint:eslint` glob (`packages/**/src/**`, which this directory doesn't match) — it's not
shipped, versioned, or held to this repo's own lint/prettier rules, since most of its files are
`create-next-app`'s own boilerplate.
