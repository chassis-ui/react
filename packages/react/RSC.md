# React Server Components

`@chassis-ui/react` ships a single package-level `'use client'` directive rather than
per-component ones. This doc explains why, what it means for a consuming app, and how to verify it
if the build ever changes.

## Why a single directive, not per-component

The build is a single bundle (`src/index.ts` → `dist/index.js` — see `AGENTS.md`'s "Build"
section), not per-component chunks, so a per-component directive has nowhere to attach to in the
output even if every source file had one.

That single-bundle shape happens to be the right call anyway: audited 2026-08-05, ~90% of the
package's component files (129 of 143) either call a React or react-aria/react-stately hook
(`useState`, `useId`, `useContext`, ...) or use `forwardRef` — both of which require a client
runtime; `forwardRef` specifically because refs aren't a concept Server Components support. The
files that don't are almost entirely collection-item renderers (`TableCell`, `ComboboxItem`,
`AutocompleteGroup`, ...) that only ever render as a child read by their hook-using parent's
collection API — not something a consumer imports and renders standalone. There's no meaningful
subset of the public API left to carve out as server-safe, so per-component chunking would add real
build complexity (multi-entry tsdown/Rolldown output, `sideEffects`/`exports` map changes) for close
to zero practical benefit. Re-audit this if the component mix changes significantly — see "How to
verify" below for the exact check.

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

The directive that ships is the one on the first line of `src/index.ts`. Rolldown (the bundler
tsdown is built on) drops module-level directives when bundling, but _entry_ modules are the
documented exception ([Rolldown's own directive
docs](https://rolldown.rs/in-depth/directives)) — and `src/index.ts` is this bundle's entry, so its
directive survives.

`tsdown.config.ts` used to also re-add it as an `output.banner`, from a time when Rolldown dropped
it here too. Once Rolldown started preserving it, the two stacked up and the published bundle began
with a duplicated `'use client';"use client";`. Valid JavaScript — a directive prologue may hold
several string literals — but not something to ship, so the banner is gone.

That leaves the directive dependent on Rolldown's entry-module behavior holding across upgrades,
which `pnpm check:rsc` (`scripts/check-rsc-directive.ts`, run in CI right after
`pnpm react:check:api`) asserts directly rather than trusting anyone to remember. It fails if
`dist/index.js` doesn't start with a `'use client'` directive, if it carries more than one (the
banner regression), or if one leaks into `dist/index.d.ts` — a known open upstream issue,
[rolldown-plugin-dts#174](https://github.com/sxzz/rolldown-plugin-dts/issues/174), that hasn't
reproduced with the versions this package pins. Run it after any tsdown/rolldown version bump; CI
does it on every PR.
