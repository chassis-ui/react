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

## `component` polymorphism: ask for the element's kind, don't compare tags

A render function that treats elements differently (a real `disabled` on a `<button>`,
`aria-disabled` and a click guard on an `<a>`, a `<div>` instead of a `<ul>` around a link) never
compares `component` to a tag name and never checks `typeof component`. It asks
`resolveElementKind(Component)`, which returns `anchor`, `button`, `input`, `host` or `component`,
or `resolveElementTag(Component)` when it needs a tag that has no kind, such as `ul`
(`src/utils/elementKind.ts`).

The reason is `asChild`. Under it, `component` is a `Slot` that stands in for the caller's child
element and carries that element's kind and tag, so `Component === 'a'` is false for a slotted
`<a>` and the component would skip its own link handling. For the same reason a branch renders
`Component` typed as its tag (`const Anchor = Component as 'a'`), not a literal `<a>`. A parent
that reads a child's props (`List` reading its `ListItem`s) uses `resolveKindFromProps`.

`test/utils/asChild.matrix.spec.tsx` enforces both halves: it fails on a tag comparison in
`src/components`, and on any component whose `asChild` output differs from its `component="a"`
output.

## `href`: one rule for every component that takes it

A component that accepts `href` renders an `<a>` when it is set, unless `component` or `asChild`
chose the element. Without `href` it renders its own default: `<button>` for `Button`,
`CloseButton`, `PaginationItem` and `MenuItem`, `<li>` for `ListItem` and `StepperItem`, `<span>` for
`Chip`, `Avatar` and `NavbarBrand`. `href` then reaches the rendered element only if that element
can take it: an `<a>`, or a component reference, which is trusted to (a router link takes `href`
itself). A component reference given `href` or `to` is a link, and gets everything an `<a>` gets:
`aria-disabled`, `tabindex="-1"` and a blocked click when disabled, and the component's link
classes. That is the same whether the router link is `component` or the `asChild` element
(`resolveLinkKind`). A `<button>`, an `<li>` or any other tag never carries `href`; the component drops it and
warns in development. An empty string is set, since `href=""` is a link to the current document.

A render function doesn't write this itself. It calls `linkElement(component, href, fallback)` for
the element and spreads `hrefProps(kind, href, displayName)` for the attribute
(`src/utils/elementKind.ts`). A parent that picks its own element from its children (`List`,
`Stepper`) reads an item's `href` through `resolveKindFromProps`, which counts it as an anchor.

`MenuItem` follows chassis-css, which styles `<a class="menu-item">` and
`<button class="menu-item" type="button">` alike. A `NavItem` renders its `NavLink` for `href`,
`component` or `asChild`, and otherwise a bare `<li>` that takes none of the link's props.

`test/utils/href.matrix.spec.tsx` renders every component whose props include `href` (read from
the generated prop tables) with `href` alone, with a router link, and with a `<div>` and a
`<button>` as `component`. `test/ssr/render.spec.tsx` fails any story whose markup has `href` on
anything but a link.

## Open state: `visible`, `defaultVisible`, `onVisibleChange`

A component that shows and hides takes its state under these three names, and no others:

- `visible` is controlled. When it is set, the component shows and hides only when it changes.
  What the component would have done itself (a trigger click, Escape, a click outside, a close
  button, the `autohide` timer) becomes a request, reported to `onVisibleChange` and nothing more.
- `defaultVisible` is the initial state of an uncontrolled component, which then shows and hides
  itself.
- `onVisibleChange(visible)` receives the state the component asks for, controlled or not. It
  takes a state setter as it is: `visible={open} onVisibleChange={setOpen}`.

`Popover`, `Tooltip`, `Menu`, `ContextMenu`, `Modal`, `Alert`, `Drawer`, `Toast`, `Notification`,
`DatePicker` and `DateRangePicker` take all three. A component that cannot change its own state takes `visible`
only: `Collapse` has no trigger, timer or close button, so a default could never differ from the
prop and the callback would never fire.

The event callbacks are separate and keep their meaning. `onShow`/`onHide` (and `onShown`/
`onHidden`) report what happened to the element; `onClose` on `Modal`, `Alert` and `Drawer` is the close
request, fired beside `onVisibleChange(false)`; `onClose` on `Toast` and `Notification` fires
after the exit transition. None of them carries the state, so don't build a controlled component
from `onShow` and `onHide`: under `visible` a request that isn't followed never shows anything.

In the code:

- A component built on a react-stately trigger state (`useOverlayTriggerState`,
  `useTooltipTriggerState`, `useMenuTriggerState`, the date picker states) passes it
  `useOpenStateProps(props, displayName)` (`src/hooks/useOpenStateProps.ts`). Those states are
  controlled by `isOpen` already.
- Anything else holds the state with `useControllableState`, given the three props:
  `useDialogElement` for `Modal`, `Alert` and `Drawer`, `useDismissibleTransition` for `Toast` and
  `Notification`.
- A request that is dropped because `visible` is set and there is no `onVisibleChange` warns once
  in development (`warnDroppedVisibleRequest`). `Modal`, `Alert` and `Drawer` don't warn:
  `visible` with `onClose` is complete for them.
- Never copy `visible` into state and sync it in an effect. That is what these components did
  before, and it is why a parent could not hold one closed.

Two exceptions in naming. `Accordion` and `AccordionItem` take `open`, the attribute of the
native `<details>` they render. `DatePicker` and `DateRangePicker` also still accept react-aria's
`isOpen`/`defaultOpen`/`onOpenChange`, deprecated.

`test/utils/visibleState.spec.tsx` runs the same cases against every component in the list. A new
component that shows and hides gets an entry there.

## Reading children: resolve them first

A component that inspects its children before rendering them never writes
`isValidElement(child) && child.type === ListItem`, and never reads `child.props` of a child it
hasn't resolved. It uses `isElementOfType(child, ListItem)` and `resolveLazy(child)`
(`src/utils/lazyElement.ts`).

The reason is React Server Components. Written in a Server Component, a client component's element
has a lazy wrapper as its `type`, and an element whose props are still loading arrives as a lazy
node with no `props` at all. See `RSC.md`. `React.Children.toArray`, `map` and `forEach` resolve
lazy nodes themselves, so children that went through one of them are elements; their types still
need `isElementOfType`.

`test/utils/lazyChildren.spec.tsx` fails on a type comparison anywhere in `src/`, and renders each
child-reading component with lazy nodes and with lazy types. A new component that reads its
children gets a case there and a route in `smoke-tests/nextjs-app-router/app/rsc/`.

## Refs: to the element the other attributes go to

Every exported component forwards a ref, to the element its other attributes (`className`,
`...rest`) go to: `Autocomplete`'s and `Combobox`'s go to the `.combobox` element, `Tooltip`'s and
`Popover`'s to the panel. A component with no element of its own at a given moment leaves the ref
`null` then: `FormField` while it renders its children bare, `SkeletonLoader` once the content has
loaded (while loading, the ref is the first generated skeleton). Collection parts (`Tab`,
`TableRow`, `ComboboxItem`, ...) and providers render no element and take no ref.

A component that decorates an element it doesn't own, such as the trigger of a `Tooltip`, doesn't
`cloneElement` it by hand. It takes the element with `getTriggerChild` and renders it with
`renderSlotted` (`src/utils/slot.tsx`), the path `asChild` uses: the element's own props win,
classNames concatenate, handlers chain (the component's first), `aria-describedby` adds up, an
element's own `aria-label` drops the component's `aria-labelledby` (which would outrank it), and the
component's ref is forked with the one the caller put on the element (`getElementRef`). Attributes
that state the component's own condition, such as a `Popover` trigger's `aria-expanded` and
`aria-controls`, are passed as `owned` and win over the element's. Every element renders through
the same `Slot`, so a trigger isn't remounted when its `href` comes or goes.

`test/utils/refForwarding.spec.tsx` fails on an exported component that isn't a `forwardRef`,
unless its allowlist names it.

## Server HTML: what the page settles to

A component's server HTML is what it settles to once hydrated, because that HTML is the page until
the JavaScript has loaded. State an effect would compute in the browser (the selected tab, the
number of slides, a transition's settled phase) is computed during render instead, where the
server runs it too. Only what a server can't know waits for hydration, through `useHydrated`
(`src/components/portal/Portal.tsx`): a position (`Menu`'s open list), the viewer's time zone (the calendars'
"today"), and any reference to portaled content (a trigger's `aria-controls`). Hydration then
renders the server's value first, so it never mismatches.

An id-reference attribute (`aria-describedby`, `aria-labelledby`, `aria-controls`, `for`) names only
elements the component renders on the same pass. react-aria's hooks don't hold to that on the
server (`FORMS.md`, gotcha 6); `joinIds` and `withoutSlotIds` (`src/utils/idRefs.ts`) build the
value instead.

`test/ssr/render.spec.tsx` fails on a story whose server HTML refers to a missing id, and asserts
the first paint of each case in `test/ssr/firstPaint.tsx`, which `hydrate.spec.tsx` hydrates too. A
component whose markup changes after it mounts gets a case there.

## Measured layout: read in a layout effect, commit before the paint

`NavOverflow` is the one component whose markup depends on a width. How it does that without a
frame of the wrong markup, for anything that comes to need the same:

- **The server renders what needs no measuring**, and says so in the SSR guide: every item, with
  the toggle item in the list and hidden. `useHydrated` holds a style for the time before the
  first measurement (the row clipped and scrollable), so nothing a server can't know is in its
  HTML.
- **Measure in a layout effect, set state there.** React renders that update before the browser
  paints. The list measures again after each of its commits.
- **From an observer, commit with `flushSync`.** A `ResizeObserver` callback runs before the
  paint too, but a plain state update from it renders a task later, which is one frame of items
  running past the edge. A `MutationObserver` covers what resizes nothing, such as a router link
  that becomes the current one.
- **Measuring may change the DOM, and must put it back before it returns.** Widths are read with
  every item shown, outside React, in one synchronous block. React never sees the difference, and
  a forced layout after restoring keeps other observers from being told sizes that were never
  painted.
- **Don't feed the result back in.** Observe the element whose width is an input (the wrapper),
  never one whose width the result changes (the list). Changing a size from inside the callback
  that reported a size above it is a `ResizeObserver` loop error: an item's own resize waits a
  frame, and the wrapper is observed again from the next frame after a pass that moved anything.
- **What is measured registers itself.** An item registers its element and its link's props
  through context (`src/utils/navOverflow.tsx`), under an id of its own, so a wrapper component,
  a fragment, or a Server Component's lazy element makes no difference. The menu renders
  `MenuItem`s from those props. Nothing is cloned, so handlers and router links keep working.

jsdom lays nothing out: `test/components/nav-overflow/NavOverflow.spec.tsx` gives the widths and
a `ResizeObserver` itself, and the stories' `play` functions check the same in three real
browsers.

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
