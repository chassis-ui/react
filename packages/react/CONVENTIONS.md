# Conventions

Rules for the naming/architecture migration tracked in
`.claude/plans/chassis-react-enterprise-migration.md`. Phase 1 onward executes these mechanically
— this file is what makes the rename a series of mechanical batches instead of ad hoc judgment
calls made 52 times. When in doubt during a batch, this file wins over whatever the pre-migration
code did.

## Component naming

`PascalCase`, no prefix: `CxButton` → `Button`, `CxAvatarStack` → `AvatarStack`.

## Prop/interface naming

`<Component>Props`: `CxButtonProps` → `ButtonProps`.

Change-event props are `onChange` — every component in this library already uses this spelling
(41 components audited, zero uses of `onValueChange`). Don't introduce `onValueChange` as an
alternate spelling; the ESLint rule in `eslint.config.js` flags it as an error.

`tone` isn't part of this library's vocabulary (colors/variants are named `color`/`variant`).
Don't introduce it as a synonym; also flagged as an error.

## File naming

`Component.tsx` (drop `Cx` from filenames too). Test files: `Component.spec.tsx`.

## Folder layout: three separate trees, not colocation

- `src/components/<kebab-name>/` — only the component file(s) (`<PascalName>.tsx`) and the
  folder's `index.ts` barrel, with one narrow exception: a private, non-`.tsx`-or-lowercase-`.tsx`
  helper module (state/context, a pure algorithm, internal keyboard-nav logic, ...) that is never
  exported from the folder's `index.ts` and never imported from outside the folder — e.g. each of
  `accordion/context.ts`, `checkbox/context.ts`, `radio/context.ts`, `tabs/context.ts` (compound-
  family-shared React context), `menu/submenuGroup.ts`, `menu/menuNavigation.ts`, and
  `password-strength/strengthScore.ts`. The moment a helper like this gets a second consumer
  outside its own folder, it stops qualifying for this exception and moves out: a hook (`useXxx`)
  goes to `src/hooks/`, anything else goes to `src/utils/` — regardless of how many folders end up
  using it there (`src/hooks/useFormField.ts` and `src/utils/virtualFocusStyle.ts` are both single-
  or few-consumer today and still live there, not colocated with their caller, because "is it a
  hook / is it a component" decides the folder, not consumer count).
- `stories/<family>/<Component>.stories.tsx` — Storybook stories, centralized separately from
  the component they document (matched by `.storybook/main.ts`'s glob against anywhere under
  `src/`, so this is an organizational choice, not something the glob requires).
- `test/components/<kebab-name>/<PascalName>.spec.tsx` (plus `test/components/<kebab-name>/
__snapshots__/` for snapshot files) — mirrors `src/components/` the same way `stories/`
  does, under the top-level `test/` folder that also holds shared setup (`test/setup.ts`, etc.).

Colocating tests or stories beside the component (`__tests__/` inside `src/components/<kebab>/`)
is the pre-migration shape and no longer used — several components have multiple files/sub-parts,
which colocation made messy once the library grew past a handful of simple components.

## Per-component barrels

Every component folder gets its own `index.ts`. The central `src/index.ts` re-exports from these
barrels instead of reaching into component files directly — `import { Button } from
'./components/button'`, not `from './components/button/Button'`.

## Compound-component API: flat, prefixed exports

Sub-parts of a compound family are exported as their own top-level named export, prefixed with the
root's name — `AccordionItem`, not `Accordion.Item`. Both the root and every part are separately
importable:

```ts
import { Accordion, AccordionItem } from '@chassis-ui/react'
```

Implemented as flat re-exports in the folder's `index.ts` barrel (not inside the component file
itself):

```ts
export { Avatar } from './Avatar'
export type { AvatarProps } from './Avatar'
export { AvatarImage } from './AvatarImage'
export type { AvatarImageProps } from './AvatarImage'
export { AvatarStack } from './AvatarStack'
export type { AvatarStackProps, AvatarStackItemDef } from './AvatarStack'
// plop:sub-export
```

The `// plop:sub-export` comment is the marker `pnpm generate:sub` appends after — write it by
hand on the family's first sub-part (as shown above) so every part after that can be generated.
Unlike the old namespace shape, there's no trailing-comma constraint to work around: these are
independent top-level `export` statements, not entries in an object literal, so order doesn't
matter and new parts are simply appended after the marker.

The central `src/index.ts` also imports and re-exports every sub-part by name, same as any other
top-level export — `pnpm generate:sub` wires this automatically via the same `// plop:import` /
`// plop:export` markers the root-level `pnpm generate` generator already uses.

Notes:

- Internal cross-references between sibling files (e.g. `Avatar.tsx` rendering `<AvatarImage>`
  internally) keep importing directly from the sibling file, not through the package's public
  barrel.
- Applies only to genuine root+parts families. See the migration plan's "Compound-family
  inventory" (Ground Truth section) for which folders qualify.
- Documented flat exceptions — these were never compound in the first place, nothing to convert:
  `Grid` (`Container`/`Row`/`Col` — no natural root), `Form` (`Form`/`FormLabel`/`FormHelp`/
  `FormFeedback` — `Form` is each component's own identity, not a namespace marker for shared
  pieces), `CheckboxGroup`/`RadioGroup`, `Toast`'s `Toaster`, `ButtonGroup`'s `ButtonToolbar`.
- A second, narrower exception: `Tabs`' own parts are `TabList`/`Tab`/`TabPanel`, not
  `TabsList`/`TabsTab`/`TabsPanel`. Mechanically prefixing with the root name would produce
  `TabsTab` — the root and the part repeating the same word (`Tab`) right next to each other.
  Instead these three mirror, name-for-name, the react-aria hooks each one wraps (`useTabList`,
  `useTab`, `useTabPanel`) and the equivalent components in `react-aria-components` itself — a
  deliberate exception, not an oversight, and not a precedent for dropping the parent-name prefix
  elsewhere. `Tabs` (the root) keeps the family's own identity same as every other family's root.
- History: this library briefly used a namespace-only API (`Accordion.Item`, via `Object.assign`)
  between Phase 1 and Phase 1b of the migration plan, then reverted to flat exports — see the
  plan's "Amendment (post Phase 1)" section for the reasoning.

## Sass usage policy

`@chassis-ui/css` classes remain the default styling mechanism for every component. A
component-local `.scss` file is only justified when:

- chassis-css has no equivalent class at all (documented exception: the calendar/datepicker
  family and `Table`'s sort/selection UI — see `THEMING.md`'s "Component-scoped CSS"), or
- chassis-css has partial coverage that would otherwise be duplicated as hardcoded values in the
  component.

Reach for a chassis-css class first; reach for tokens/functions/mixins via `@use` before hardcoded
colors, spacing, or radii; only write component-scoped CSS as a last resort.

## What isn't caught by lint

`eslint.config.js` flags `Cx`-prefixed _identifiers_ (warn during Phase 1, error from Batch G
onward) and `onValueChange`/`tone` identifiers (error). Neither rule catches string literals:
internal-only `cx-*` CSS class-name strings and `data-cx-*` HTML attributes both need an explicit
grep, not a lint pass — see the migration plan's Ground Truth section for which of those are in
scope for renaming (`cx-*` class strings) and which are staying as-is (`data-cx-*` attributes,
because `@chassis-ui/css` selects on them directly).
