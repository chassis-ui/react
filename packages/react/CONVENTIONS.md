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

## Per-component barrels

Every component folder gets its own `index.ts`. The central `src/index.ts` re-exports from these
barrels instead of reaching into component files directly — `import { Button } from
'./components/button'`, not `from './components/button/Button'`.

## Compound-component API: namespace-only

Sub-parts of a compound family are exposed as properties on the root component, not as separate
top-level exports. `Accordion.Item`, not `AccordionItem` — and `AccordionItem` is **not**
separately exported from the package.

Implemented via `Object.assign` on the root component, inside the folder's `index.ts` barrel (not
inside the component file itself):

```ts
import { Avatar as AvatarRoot } from './Avatar'
import { AvatarImage } from './AvatarImage'
import { AvatarStack } from './AvatarStack'
// plop:sub-import

export const Avatar = Object.assign(AvatarRoot, {
  // plop:sub-entry
  Image: AvatarImage,
  Stack: AvatarStack
})
export type { AvatarProps } from './Avatar'
export type { AvatarImageProps } from './AvatarImage'
export type { AvatarStackProps } from './AvatarStack'
// plop:sub-type
```

The three `// plop:sub-*` comments are markers `pnpm generate:sub` appends after — write them by hand
on the family's first sub-part (as shown above) so every part after that can be generated. The
entry marker goes right after the opening `{` of the `Object.assign` object, not at the end —
this repo's Prettier config (`trailingComma: "none"`) forbids a trailing comma on the last key, so
appending new keys at the *top* keeps every existing line's comma valid without reformatting it.

Notes:

- Props types stay flat-named (`AvatarImageProps`, not `Avatar.ImageProps`) — TypeScript has no
  clean namespaced-type equivalent, and this matches how Radix/Ark do it.
- Internal cross-references between sibling files (e.g. `Avatar.tsx` rendering `<AvatarImage>`
  internally) keep importing directly from the sibling file, not through the namespace — the
  namespace is assembled once, in `index.ts`, as a public-API concern only.
- Applies only to genuine root+parts families. See the migration plan's "Compound-family
  inventory" (Ground Truth section) for which folders qualify as-is, which need a closer read
  before deciding, and which are documented flat exceptions.
- Documented flat exceptions (not an oversight, don't namespace these): `Grid`
  (`Container`/`Row`/`Col` — no natural root), `Form` (`Form`/`FormLabel`/`FormHelp`/
  `FormFeedback` — `Form` is each component's own identity, not a namespace marker for shared
  pieces). `CheckboxGroup`/`RadioGroup` and `Toast`'s `Toaster` are candidates for the same
  bucket — confirmed one way or the other during their Phase 1 batch, not assumed here.

## Sass usage policy

`@chassis-ui/css` classes remain the default styling mechanism for every component. A
component-local `.scss` file is only justified when:

- chassis-css has no equivalent class at all (documented exception: the calendar/datepicker
  family), or
- chassis-css has partial coverage that would otherwise be duplicated as hardcoded values in the
  component.

Reach for a chassis-css class first; reach for tokens/functions/mixins via `@use` before hardcoded
colors, spacing, or radii; only write component-scoped CSS as a last resort.

## What isn't caught by lint

`eslint.config.js` flags `Cx`-prefixed *identifiers* (warn during Phase 1, error from Batch G
onward) and `onValueChange`/`tone` identifiers (error). Neither rule catches string literals:
internal-only `cx-*` CSS class-name strings and `data-cx-*` HTML attributes both need an explicit
grep, not a lint pass — see the migration plan's Ground Truth section for which of those are in
scope for renaming (`cx-*` class strings) and which are staying as-is (`data-cx-*` attributes,
because `@chassis-ui/css` selects on them directly).
