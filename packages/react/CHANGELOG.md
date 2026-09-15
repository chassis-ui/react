# @chassis-ui/react

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
