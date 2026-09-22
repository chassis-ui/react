# React Server Components

`@chassis-ui/react` ships a `'use client'` directive on every published JS entry point: the root
`@chassis-ui/react` (`dist/index.js`) and one subpath per component folder
(`@chassis-ui/react/button` → `dist/button.js`, see "Subpath imports" below). This doc explains
why, what it means for a consuming app, and how to verify it if the build ever changes.

## Why a directive per entry, not per component

Each entry is a thin re-export over shared chunks (`dist/chunks/*.js`); the entries are the only
modules a consumer's bundler reaches through the `exports` map, so they're where the client
boundary has to be declared. Rolldown preserves a directive only on _entry_ modules — so every
component folder's `index.ts` barrel (each one a tsdown entry) carries its own `'use client'` first
line, alongside `src/index.ts`'s. Shared chunks deliberately carry none: they're only reachable
through an entry that already established the boundary.

A client boundary per component folder (rather than a server-safe subset) is still the right call:
audited 2026-08-05, ~90% of the package's component files (129 of 143) either call a React or
react-aria/react-stately hook (`useState`, `useId`, `useContext`, ...) or use `forwardRef`. The
files that don't are almost entirely collection-item renderers (`TableCell`, `ComboboxItem`,
`AutocompleteGroup`, ...) that only ever render as a child read by their hook-using parent's
collection API — not something a consumer imports and renders standalone. Re-audit this if the
component mix changes significantly — see "How to verify" below for the exact check.

## What this means for a consuming app

Nothing extra. Import and render any `@chassis-ui/react` component directly inside a Server
Component — no local `'use client'` wrapper needed on the consumer's side:

```tsx
// app/page.tsx — a Server Component, no directive of its own
import { Button, Switch } from '@chassis-ui/react'

export default function Page() {
  return (
    <main>
      <Button>Click me</Button>
      <Switch defaultSelected>Hook-backed, works fine here</Switch>
    </main>
  )
}
```

Next.js's (or any RSC-aware bundler's) build sees the directive, registers every export from
`@chassis-ui/react` as a client reference, and renders/hydrates it correctly — no explicit
client-component boundary needed in the app itself.

The usual RSC rule about **props crossing the server→client boundary still applies**: whatever a
Server Component passes down (e.g. an inline function to `onClick`) has to be serializable or
itself defined in a Client Component. That constraint comes from React/Next.js, not from anything
specific to this package.

## Subpath imports

Until 0.2.0 the package was one `dist/index.js` with one directive. A `'use client'` module is a
client-reference boundary, and Turbopack (Next.js 16's default bundler) doesn't tree-shake unused
exports through one — so a page importing only `Button` from `@chassis-ui/react` shipped every
component, and every react-aria/react-stately hook they use, to the browser. Measured in
`smoke-tests/nextjs-app-router` with a page rendering a single `<Button>` (client JS beyond
Next.js's own baseline, gzip):

| Build                                    | Turbopack | webpack |
| ---------------------------------------- | --------- | ------- |
| 0.1.3, `from '@chassis-ui/react'`        | ~214 KB   | ~214 KB |
| 0.2.0, `from '@chassis-ui/react'`        | ~223 KB   | ~16 KB  |
| 0.2.0, `from '@chassis-ui/react/button'` | ~13 KB    | ~11 KB  |

So every component folder is now also its own entry, published as `@chassis-ui/react/<folder>`
(the folder names under `src/components/` — `button`, `table`, `text-input`, `datepicker`, ...),
exporting exactly what that folder's barrel exports, plus the family's hook where there is one
(`useModal` from `/modal`, `useToast` from `/toast`, ...). The root entry is unchanged and still
exports everything. Under webpack the root import now tree-shakes too, because `sideEffects`
became accurate (see `AGENTS.md`'s "Build"); Turbopack still doesn't through the `'use client'`
barrel, which is why subpaths are the recommended import for size-sensitive routes.

Mixing the two is safe: both resolve to the same shared chunks, so `Modal` from
`@chassis-ui/react/modal` and `useModal` from `@chassis-ui/react` see the same context instance.

## How to verify (if the build changes)

Confirmed 2026-08-05 with a throwaway Next.js App Router project (`create-next-app`, App Router,
React 19) depending on this package via `file:`, not committed to this repo:

- **With the directive** (current state): a Server Component importing `Button`/`Switch`/`Badge`
  directly builds and prerenders successfully; `.next/server/app/page_client-reference-manifest.js`
  lists `@chassis-ui/react` as a client reference, and the prerendered HTML contains the real
  rendered markup.
- **Without it** (at the time, by temporarily stripping `output.banner` from `tsdown.config.ts`;
  today the equivalent is stripping the directive from the first line of `src/index.ts`, rebuilding
  and reinstalling into the smoke app): the same page fails with `TypeError:
i.default.createContext is not a function` during `next build`'s page-data collection — an
  unhelpful crash, not a clean "needs a Client Component" message, which is exactly why shipping
  the directive ourselves (rather than leaving it to every consumer to wrap things) matters.

The directives that ship are the ones on the first line of `src/index.ts` and of every
`src/components/<folder>/index.ts` barrel. Rolldown (the bundler tsdown is built on) drops
module-level directives when bundling, but _entry_ modules are the documented exception
([Rolldown's own directive docs](https://rolldown.rs/in-depth/directives)) — and each of those
files is an entry, so its directive survives. A new component folder needs the directive on its
barrel's first line (plus the `suppressFocusRingGlobally` import the other barrels carry — see
`src/index.ts`'s comment); `pnpm check:rsc` fails the build if the directive is missing.

`tsdown.config.ts` used to also re-add it as an `output.banner`, from a time when Rolldown dropped
it here too. Once Rolldown started preserving it, the two stacked up and the published bundle began
with a duplicated `'use client';"use client";`. Valid JavaScript — a directive prologue may hold
several string literals — but not something to ship, so the banner is gone.

That leaves the directive dependent on Rolldown's entry-module behavior holding across upgrades,
which `pnpm check:rsc` (`scripts/check-rsc-directive.ts`, run in CI right after
`pnpm react:check:api`) asserts directly rather than trusting anyone to remember. It fails if any
`dist/*.js` entry doesn't start with a `'use client'` directive, if one carries more than one (the
banner regression), if a shared `dist/chunks/*.js` chunk carries one, or if one leaks into a
`.d.ts` file — a known open upstream issue,
[rolldown-plugin-dts#174](https://github.com/sxzz/rolldown-plugin-dts/issues/174), that hasn't
reproduced with the versions this package pins. Run it after any tsdown/rolldown version bump; CI
does it on every PR.
