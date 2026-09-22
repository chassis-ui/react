# @chassis-ui/react

## 0.2.0

### Minor Changes

- 54d4178: Every polymorphic component now accepts `asChild`, which makes the polymorphic API usable from
  React Server Components (#23). Pass the target as a child element instead of a component
  reference, and the component merges its classes, props and ref onto that element:

  ```tsx
  import Link from 'next/link'
  import { Button } from '@chassis-ui/react/button'

  // In a Server Component
  <Button asChild variant="outline">
    <Link href="/login">Log in</Link>
  </Button>
  ```

  `<Button component={Link} href="/login">` fails `next build` in a Server Component under Next.js
  16 with "Functions cannot be passed directly to Client Components". A component reference is a
  function and can't cross the server→client boundary; it only worked before because older
  `next/link` exports weren't plain functions. An element crosses the boundary without trouble.
  The rendered `<a>` gets the button's classes, and `next/link` still handles the navigation
  client-side.

  The child's own props win over the component's, except that class names are combined and event
  handlers are chained (the component's runs first). If `children` isn't exactly one element,
  `asChild` logs a dev warning and the component renders its default element. `asChild` takes
  precedence when both it and `component` are passed.

  `asChild` is implemented once in the shared polymorphic wrapper, so it works on every component
  with a `component` prop. `SkeletonLoader` is the exception because it renders no element of its
  own. `component` itself is unchanged.

- 3e3f7c1: Icons are now configurable, and the components that draw icons of their own no longer depend on
  `Icon`.

  **Breaking: `Icon` no longer references `/static/icons/chassis-icons.svg` by default.** With no
  `sprite` set, it renders `<use href="#name">`, which works for a sprite embedded in the page. To
  keep the old behavior, set the path once for the whole app:

  ```tsx
  <IconProvider sprite="/static/icons/chassis-icons.svg">{children}</IconProvider>
  ```

  **New `IconProvider`.** It sets defaults for every `Icon` below it (`sprite`, `className`, `font`,
  `fontPrefix` for icon fonts generated with a prefix other than `cx-`) and configures the icons
  this library's own components draw. Nested providers extend the one above them.

  **Replaceable library icons.** `Pagination`, `CarouselControlPrev`/`CarouselControlNext`,
  `CarouselPlayPause`, `NavbarToggler`, the check on a selected menu or combobox item, and a string
  `icon` on `Toast`/`Notification` now ask for their icon by purpose: `check`, `previous`, `next`,
  `menu`, `play` or `pause`. You can replace any of them with another icon name or with an element
  from any icon set:

  ```tsx
  import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

  <IconProvider icons={{ check: <Check />, previous: <ChevronLeft />, next: <ChevronRight /> }}>
  ```

  You can also render every icon name with your own icon component (`component={MyIcon}`, set in a
  `'use client'` module). A single instance can override its icon with the new `previousIcon`/
  `nextIcon` (Pagination), `icon` (carousel prev/next controls, NavbarToggler), and
  `playIcon`/`pauseIcon` (CarouselPlayPause) props. A custom icon gets the class the component
  positions it by, including `directional-icon`, so arrows still flip in right-to-left layouts. It
  doesn't get `.icon`, whose `fill` would paint over outline icon sets.

  **Pagination's previous/next chevrons are now the outline style,** matching the carousel's.

  **Fix: `Icon`'s `size` had no visible effect when chassis-css was loaded.** It set only the SVG's
  `width`/`height` attributes, which chassis-css's `.icon` sizing overrides, so `size={48}` rendered
  at 24px. It now sets `--cx-icon-size`, which also makes it work for font glyphs, and accepts CSS
  lengths as well as pixel numbers (`size="1.25rem"`).

- 6103315: Adds `StaticTable`, a server-renderable table that uses no client JavaScript (#20). It takes the
  same styling props as `Table` (`bordered`, `borderless`, `hover`, `striped`, `sm`, `color`,
  `align`, `responsive`, `stacked`, plus `caption`) and renders your own
  `<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>` markup as written. It has no sorting, selection
  or keyboard grid navigation; those remain `Table`'s job.

  Import it from `@chassis-ui/react/static-table`. It's the only entry point without a
  `'use client'` directive, so a React Server Component renders it as a real Server Component. In a
  Next.js 16 app, a route rendering only a `StaticTable` ships no client JS beyond Next's own
  baseline. Links, `next/link` and server-action forms in cells work as they do in any server markup.

  ```tsx
  import { StaticTable } from '@chassis-ui/react/static-table'

  <StaticTable hover striped caption="Members">
    <thead>
      <tr><th scope="col">Name</th></tr>
    </thead>
    <tbody>
      {members.map((m) => (
        <tr key={m.id}><td data-cell="Name">{m.name}</td></tr>
      ))}
    </tbody>
  </StaticTable>
  ```

  For `stacked` tables, give each `<td>` a `data-cell` attribute with its label. `Table` reads that
  label from its column headers, but a static table has no column data to derive it from.
  `StaticTable` is exported from the root entry too, for use inside Client Components.

- a92d1e9: Every component family is now published as its own entry point, so a page only ships the
  components it actually imports (#22). The subpaths are named after the component folders:

  ```tsx
  import { Button } from '@chassis-ui/react/button'
  import { TextInput } from '@chassis-ui/react/text-input'
  import { Modal, ModalBody, useModal } from '@chassis-ui/react/modal'
  ```

  Until now the package was a single `dist/index.js` behind one `'use client'` directive. Turbopack
  (Next.js 16's default bundler) can't tree-shake unused exports out of a `'use client'` module, so a
  page rendering one `Button` shipped every component, and the react-aria/react-stately hooks behind
  them, to the browser: about 214 KB gzip of client JS on top of Next.js's own baseline, whichever
  bundler was used. Importing the same `Button` from `@chassis-ui/react/button` ships about 13 KB
  under Turbopack and 11 KB under webpack. Each subpath carries its own `'use client'` directive, so it
  works directly from a Server Component, just like the root entry.

  The root `@chassis-ui/react` entry is unchanged and still exports everything. Both import styles
  resolve to the same shared chunks, so mixing them is safe: `Modal` from `/modal` and `useModal` from
  the root read the same context. Each family's hook is also exported from its subpath (`useModal`,
  `useDrawer`, `useToast`, `useNotification`, `usePagination`).

  `sideEffects` in `package.json` is now accurate. Only the entry files, the chunk that installs the
  global focus-ring listener, and `style.css` are marked as having side effects, so webpack and Vite
  also drop unused components from a root import (about 16 KB for the same page under webpack). This
  also fixes a latent build bug: the listener's side-effect import was being tree-shaken out of the
  bundle, and it only survived because `RangeCalendar` happened to import the same module.

  The `DataGrid*Props` types are now exported from the root entry too. Before, they were only
  reachable from the component's own module.

## 0.1.3

### Patch Changes

- 0b72684: Fix `Radio`, `Checkbox` and `Switch` silently discarding `children`, which left the control with
  no accessible name. `children` was never omitted from their props types (it comes in via
  `InputHTMLAttributes`), so `<Radio value="a">Option A</Radio>` type-checked and rendered — and
  then the implementation's `{ ...rest, children: label }` overwrote it with an undefined `label`,
  so react-aria had nothing to build a name from and the visible text was dropped. A WCAG 4.1.2
  failure that no type error, runtime warning or snapshot would catch; it only shows up in an
  accessibility check or a query by accessible name.

  `children` is now accepted as an alias for `label`, which is what react-aria calls the same thing
  (`AriaRadioProps.children`) before this package renames it — so the shape React developers reach
  for first names the control. `label` still wins when both are given. `Switch`'s radio-backed
  variant (`type="radio"`) is fixed too: it spreads its rest props straight onto the `<input>`, so
  children there did not merely vanish, they reached a void element and React threw.

## 0.1.2

### Patch Changes

- 111ad96: Fix a guaranteed SSR hydration-mismatch warning on `Table`'s auto-injected select-all column
  (`selectionMode="multiple"`). react-stately's `@react-stately/table` derives that column's key
  from a module-scoped `'row-header-column-' + Math.random()` constant computed once per JS
  environment, so the `id`/`data-key` attributes react-aria puts on `TableSelectAllCell`/
  `TableSelectionCell` never match between the server render and the browser's hydration pass. The
  mismatch is confined to that internal bookkeeping attribute (no visible content, nothing else
  references it), so both cells now render with `suppressHydrationWarning` — the underlying
  react-stately behavior is unchanged and not something this package can fix.

## 0.1.1

### Patch Changes

- 02594b4: Fix `Pagination` dropping keyboard focus every time the page changes.

  `PaginationItem` rendered the active item as a `<span>`, so activating a page unmounted the focused
  `<button>` and mounted a different element in its place — focus fell to `<body>` and a keyboard user
  had to tab in from the top of the document again (WCAG 2.4.3). The active item now keeps whatever
  element it would render anyway (`<button>`, or `<a>` when given `href`), so the element identity is
  stable across activation. The `<span>` wasn't inert either: smart mode passes an `onClick`, so it
  picked up `role="button"` and `tabIndex={0}` — a synthetic button in place of the real one.

  `aria-current="page"` also moved from the wrapping `<li>` onto the control itself, which is where
  the WAI-ARIA pagination pattern puts it and where a screen reader conveys it when focus lands.
  Styling is unchanged: chassis-css matches `.pagination-link { &.active, .active > & }` and `active`
  still lands on the `<li>`.

- 02594b4: Adds `DataGrid`, a virtualized alternative to `Table` for datasets too large to mount all at once — only the rows scrolled into view are ever rendered, so a grid with thousands of rows costs the same to render as one with a dozen. Composed the same way as `Table` (`DataGridHeader`/`DataGridColumn`/`DataGridBody`/`DataGridRow`/`DataGridCell`), plus `DataGridSelectAllCell`/`DataGridSelectionCell` for selection checkboxes.

  Beyond basic virtualized rows, columns, sorting, and selection, it also supports:

  - **Pinned columns** — `pin="start"`/`pin="end"` on a `DataGridColumn` keeps it visible while the grid scrolls horizontally, with multiple pinned columns on the same side stacking in declaration order.
  - **Variable row height** — `rowHeight="auto"` (paired with `estimatedRowHeight`) measures each row from its own rendered content instead of a single fixed height shared by every row.
  - **Async/infinite loading** — `onLoadMore`/`isLoading`/`loadingContent` on `DataGridBody` fetch and append more rows as the grid scrolls near its last one, for datasets too large to load up front.
  - **Header/footer pinning** — the header row stays pinned to the top of the grid's scrollable area as body rows scroll underneath it; a new `footer` prop on `DataGrid` renders content (e.g. a totals row) pinned below the body, outside the grid's own keyboard-navigable structure.

  This adds `react-aria-components` as a runtime dependency — `DataGrid` is built on its `Virtualizer`, and it's the only component in the package that uses it. It's externalized from the bundle, so it resolves from your own `node_modules` like `react-aria` already does. Note that `react-aria-components` pins `react-aria` to an exact version, so an install may end up with a second copy of `react-aria` alongside the one this package depends on; nothing here relies on the two being the same instance.

  See the `datagrid.mdx` docs page for the full set of examples and documented scope boundaries (e.g. no stacked variant, no zebra striping, no interactive column resize/reorder — all deliberate given the virtualized rendering model).

- 02594b4: Export every component's prop types from the package entry point.

  `ButtonProps`, `TableProps`, `MenuItemDef`, `Placement`, the shared scales (`ContextColor`,
  `Sizing`, `Spacing`, ...) and the public hooks' result types were all declared but never exported,
  so `import type { ButtonProps } from '@chassis-ui/react'` failed and consumers had to re-derive
  them with `ComponentProps<typeof Button>`. All 164 type names the component barrels already
  export are now reachable from the package root.

  As a side effect, `TableBodyProps`/`TableHeaderProps` are no longer emitted under `$1`-suffixed
  names in `dist/index.d.ts` — now that this package exports its own, react-stately's same-named
  types are the ones that get suffixed instead.

- 02594b4: Fix `Popover` and `Tooltip` dropping the trigger child's `ref`.

  Both re-render their child with `cloneElement`, whose config replaces the child's `ref` outright
  rather than merging with it, so `<Tooltip><Button ref={mine} /></Tooltip>` never populated `mine`.
  Both now fork the caller's ref with their own. `Tooltip` additionally spread its react-aria
  `triggerProps` over the child's props, silently dropping a handler the caller had put on their own
  trigger (e.g. `onFocus`); both now merge them with `mergeProps` instead.

- 02594b4: Make every user-facing string the components render themselves translatable.

  `I18nProvider` drives month names, weekday names, segment order and the calendar system through
  react-aria, but a handful of strings these components render themselves had no equivalent in
  react-aria's dictionaries and were hardcoded English with no way to override them. Under
  `<I18nProvider locale="ar-SA">` a user got Arabic month names interleaved with an English
  "Previous years".

  - `Calendar`, `RangeCalendar`, `DatePicker` and `DateRangePicker` take a new `labels` prop
    (`Partial<CalendarLabels>`, merged over the English defaults) covering the year view's paging
    arrows and live-region announcements, the month/year header buttons, the calendar trigger, and
    the clear adornment. A `DatePicker`'s `labels` also reaches the `Calendar` it renders internally,
    so it's set once. The `CalendarLabels` type is exported.
  - `Breadcrumb` accepts `aria-label` for its wrapping `<nav>` landmark, which previously hardcoded
    `"breadcrumb"` on an element `{...rest}` never reached. This also lets two breadcrumb trails on
    one page be told apart in a screen reader's landmark list.

- 02594b4: Fix six behavioural defects in focus handling, overlay callbacks, handler composition and form
  field rendering.

  - **`focusRedirect` could suppress a focus ring permanently.** It saved the element's outline,
    forced it off, and restored it on blur — but a second call before that blur captured the
    already-suppressed `none` as the value to restore. Reachable by clicking twice at the same
    disabled end of an `ends="stop"` `Carousel`. It now delegates the whole suppress/restore cycle
    to `suppressFocusRing`, which owns the re-entrancy guard, rather than reimplementing it without
    one.
  - **`Popover` stole focus back to its trigger on every close.** Dismissing by clicking another
    control moved focus off whatever the user had just clicked. Focus is now reclaimed only when the
    popover still holds it, or when nothing does.
  - **`Popover`, `Tooltip` and `Menu` reported a hide on mount.** The visibility effect ran its
    "hidden" branch on the initial commit, so `onHide` (and `Menu`'s `onHidden`) fired for an overlay
    that had never been shown, before `onShow` had fired once. All of these report transitions now,
    so none fires on mount — including `onShow`/`onShown` for an overlay mounted already-open.
  - **`Carousel` let a caller's handler replace its own.** `onKeyDown`, `onMouseEnter` and
    `onMouseLeave` were overwritten by the props spread, so passing any of them silently switched off
    arrow-key navigation or pause-on-hover. They are composed now, matching the rule
    `CarouselControlPrev`/`CarouselControlNext`/`CarouselPlayPause` already follow for `onClick`.
  - **`Modal` and `Drawer` dropped a caller's `onClick` entirely.** A `<dialog>` needs `onClick` for
    its own backdrop detection, and the caller's was spread alongside it. It is chained ahead of the
    backdrop handling now, and fires for every click on the dialog.
  - **A field set both `invalid` and `valid` rendered a duplicate DOM id.** Both feedback nodes carry
    the same id, leaving every control's `aria-describedby` pointing at an ambiguous target. At most
    one renders now, invalid winning.

  Two of these change behaviour beyond restoring the documented contract, hence a minor rather than a
  patch:

  - An overlay mounted already-open (`<Popover visible>`) no longer fires `onShow`/`onShown` on
    mount. Wire up to the transition instead, or read the prop you already control.
  - `FormField` given a `className` but no `label`/`help`/feedback now renders its `.form-field`
    wrapper instead of returning the children bare — previously the class was silently dropped, so it
    had nowhere to land. Fields with no `className` still render bare, unchanged.

- 02594b4: Fix published types and package metadata that were wrong for consumers.

  - `usePagination`'s `prevRef`/`nextRef` are typed `RefObject<T | null>`, matching the
    `useRef<T>(null)` they actually come from. They were declared non-null, so `prevRef.current.focus()`
    type-checked and then threw before mount.
  - The polymorphic components that pick their element from `href` rather than `component` —
    `Button`, `Chip`, `Avatar`, `NavbarBrand`, `PaginationItem` — accept a `ref` covering the elements
    they can actually render. `<Button href="/x" ref={anchorRef}>` was a type error even though the
    runtime populated that ref with the `<a>` it rendered.
  - Dropped the `engines` field. This is a browser library with no Node runtime requirement, and
    `engines.node: '>=24'` warned on install for consumers on older Node and hard-failed under
    `engine-strict`. It also drove the build's output target; the build now pins `es2022` explicitly,
    alongside a new `browserslist` field documenting the supported floor (Chrome 107+, Edge 107+,
    Firefox 104+, Safari 16+).
  - `sideEffects` now lists `dist/` paths. It named a `src/` path no consumer resolves, so the whole
    published bundle was flagged side-effect-free while actually carrying the global focus-ring
    listener install.
  - The published bundle carries exactly one `'use client'` directive; it previously carried two.

- 02594b4: Stop dev-time misuse warnings from firing in production, and fix arrow-key direction under RTL.

  - Every `console.warn`/`console.error` in the package now goes through `devWarning`/`devError`,
    guarded on `process.env.NODE_ENV`. Nothing is logged in a consumer's production build. They're
    also de-duplicated on the message: `AccordionItem`, `Carousel`, `FormField`, `Select` and
    `FloatingInput` warned from a render body, so a warning re-fired on every render and twice per
    render under StrictMode.
  - `OtpInput`'s and `ChipInput`'s Arrow key handling now mirrors under `dir="rtl"`, matching what
    `Carousel` and `MenuSubmenu` already did. Arrow keys move by visual direction, so in an RTL field
    ArrowLeft moves _forward_ through the boxes; previously the LTR mapping was hardcoded and sent an
    RTL user backwards.

<!--
  Entries below 0.1.0 are generated by Changesets from the `.changeset/*.md` files on the repo
  root — see VERSIONING.md. `changeset version` prepends each new release above this point; don't
  hand-edit released sections.
-->

## 0.1.0

Initial public release.
