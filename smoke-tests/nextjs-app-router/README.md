# `smoke-test-nextjs-app-router`

Not a real app — a framework integration smoke test for `@chassis-ui/react`. Its only job is to
prove the package actually installs and builds cleanly inside a real Next.js App Router
application, via a real `next build`, not a synthetic `renderToString` unit test.

`app/page.tsx` is a Server Component (no local `'use client'`) importing components straight from
`@chassis-ui/react` — see [`../../packages/react/RSC.md`](../../packages/react/RSC.md) for why that
works without a consumer-side directive.

```bash
pnpm smoke:build   # from the repo root — what CI runs; builds the library first, then this app
```

`private: true`, excluded from Changesets (`.changeset/config.json`'s `ignore`) and from the root
`pnpm lint:eslint` glob (`packages/**/src/**`, which this directory doesn't match) — it's not
shipped, versioned, or held to this repo's own lint/prettier rules, since most of its files are
`create-next-app`'s own boilerplate.
