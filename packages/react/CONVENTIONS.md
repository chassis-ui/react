# Conventions

Naming, folder-layout, and architecture rules for this package. When in doubt, this file wins over
whatever an existing component happens to do.

## Naming

- **Components**: `PascalCase`, no prefix — e.g. `Button`, `AvatarStack`.
- **Props/interfaces**: `<Component>Props` — e.g. `ButtonProps`.
- **Files**: `Component.tsx`. Test files: `Component.spec.tsx`.
- **Change-event props are always `onChange`**, never `onValueChange` — the ESLint rule in
  `eslint.config.js` flags `onValueChange` as an error.
- **Colors/variants are named `color`/`variant`**, never `tone` — also flagged as an error.

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

Don't colocate tests or stories beside the component (e.g. a `__tests__/` folder inside
`src/components/<kebab-name>/`) — keep them in the separate `stories/`/`test/` trees above. Once a
component has multiple files or sub-parts, colocation gets messy fast.

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
```

New sub-parts are added by copying an existing part's `.tsx` file and export lines for the
closest similar component, not generated. These are independent top-level `export` statements,
not object-literal entries, so order doesn't matter — new parts can be added anywhere in the
barrel.

The central `src/index.ts` also imports and re-exports every sub-part by name, same as any other
top-level export — add the import and the export line there by hand alongside the barrel export.

Notes:

- Internal cross-references between sibling files (e.g. `Avatar.tsx` rendering `<AvatarImage>`
  internally) keep importing directly from the sibling file, not through the package's public
  barrel.
- Applies only to genuine root+parts families — check the component's own folder and `index.ts`
  barrel to tell whether it's a root+parts family or a standalone component; there's no separate
  inventory tracking this.
- Not every family with a shared name prefix is compound — these don't have a "root+parts"
  relationship, so this pattern doesn't apply to them: `Grid` (`Container`/`Row`/`Col` — no
  natural root), `Form` (`Form`/`FormLabel`/`FormHelp`/`FormFeedback` — `Form` is each component's
  own identity, not a namespace marker for shared pieces), `CheckboxGroup`/`RadioGroup`, `Toast`'s
  `Toaster`, `ButtonGroup`'s `ButtonToolbar`.
- `Tabs` is a deliberate exception to the prefixing rule: its parts are `TabList`/`Tab`/`TabPanel`,
  not `TabsList`/`TabsTab`/`TabsPanel`. Mechanically prefixing with the root name would produce
  `TabsTab` — the root and the part repeating the same word (`Tab`) right next to each other.
  Instead these three mirror, name-for-name, the react-aria hooks each one wraps (`useTabList`,
  `useTab`, `useTabPanel`) and the equivalent components in `react-aria-components` itself. Don't
  generalize this to other families — `Tabs` (the root) still keeps the family's own identity same
  as every other family's root.

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

`eslint.config.js` flags `Cx`-prefixed _identifiers_ as an error, plus `onValueChange`/`tone`
identifiers. Neither rule catches string literals: internal-only `cx-*` CSS class-name strings and
`data-cx-*` HTML attributes both need an explicit grep (`grep -rn "cx-" src/`), not a lint pass —
there's no separate inventory tracking which is which. `cx-*` class-name strings are in scope for
renaming like any other `Cx` reference; `data-cx-*` attributes stay as-is, because
`@chassis-ui/css` selects on them directly.

## `className` builder ordering

chassis-css base class first, then size, then `is-invalid`/`is-valid`, then the caller's
`className` last (so caller overrides win) — existing snapshot tests across the library assume
this order. Match it in any new component.

## Layout-primitive naming divergence (`Flex`/`Stack`/`Row`)

`Flex`, `Stack` and `Row` each name their axis/direction and spacing props differently —
`Flex.direction` is `'row' | 'column' | 'row-reverse' | 'column-reverse'` (mirrors CSS
`flex-direction` directly), `Stack.direction` is `'horizontal' | 'vertical'` (mirrors chassis-css's
own `.hstack`/`.vstack` classes), and `Row` has no direction prop at all (a grid row is always
horizontal). Spacing follows the same split: `Flex`/`Stack` take `gap`/`rowGap`/`columnGap` (CSS
`gap` semantics, mapped to chassis-css's `gap-*`/`row-gap-*`/`column-gap-*` utilities), while `Row`
takes `gutter`/`gutterX`/`gutterY` (Bootstrap-style grid gutters, mapped to `g-*`/`gx-*`/`gy-*`).

This is intentional, not an oversight: `Flex`/`Stack` are thin wrappers over real CSS flexbox
layout, so their prop names mirror the CSS/chassis-css primitives they map to 1:1; `Row` is a
12-column grid primitive with its own Bootstrap-derived vocabulary (`gutter`, not `gap`) that
predates and is conceptually distinct from CSS `gap`. Reconciling the three into one shared
vocabulary would be a breaking public-API rename with no functional benefit, since the underlying
mechanisms genuinely differ — don't unify them without an explicit user decision to do so.

## `component` polymorphism: `Row`/`Col` deliberately don't have it

Most components in this library take a `component` prop (`PolymorphicComponentProps<C, OwnProps<C>>`
from `utils/polymorphic.ts`) letting the caller swap the rendered root element. `grid/Row.tsx` and
`grid/Col.tsx` don't — confirmed deliberate (commit `48ed25b`, "Row/Col are out of scope,
unchanged"), reaffirmed during the 2026-08-27 audit rather than picked up opportunistically. A grid
row/column is conceptually tied to being a `<div>` in this library's 12-column grid model the same
way `Flex`/`Stack` aren't — there's no established use case (unlike `Card`'s sub-parts, or `Nav`,
both of which _were_ migrated to the polymorphic pattern in that same audit pass) pulling for a
`Row`/`Col` consumer to need a different root element. Revisit only if a concrete need surfaces,
not as a consistency sweep on its own — don't "fix" this as an accidental gap.
