# @chassis-ui/react

## 0.3.0

### Minor Changes

- c35c029: Add `Alert`, chassis-css's alert dialog: a `<dialog role="alertdialog">` opened as a modal dialog
  for a decision the flow can't continue without, such as confirming a destructive action. Compose
  `AlertIcon`, `AlertBody` with `AlertTitle`, `AlertCode` and `AlertText`, and `AlertFooter` with
  the actions. `AlertCancel` is the least destructive action: it closes the alert and has focus
  when the alert opens. Open state works like `Modal`'s (`visible`, `defaultVisible`,
  `onVisibleChange`, `onClose`), but a backdrop click and Escape don't close an alert unless
  `backdrop` and `keyboard` allow them. The title names the alert and the code and text describe
  it. Also a subpath: `@chassis-ui/react/alert`.

  `Modal`, `Drawer` and `Alert` now focus an element with `data-autofocus` when they open. The docs
  said `autofocus` worked, but React writes no `autofocus` attribute in a page rendered in the
  browser, so the dialog itself got focus instead. A closing `Modal`, `Drawer` or `Alert` also no longer
  takes focus back from a dialog opened from it, and after a chain of them focus returns to the
  element that opened the first.

- 01309f3: `ContextMenu`: the region a context menu belongs to. A right-click (`contextmenu`, so Ctrl+click on
  macOS too), a long press by a finger or a pen, or Shift+F10 and the context menu key on a focused
  element inside it open the menu at that point, in place of the browser's own. The menu is a
  `MenuList` among the region's children, with `Menu`'s items, headers, dividers, submenus and
  `items` data, portaled to the body or to the open `<dialog>` around the region, and positioned with
  its start corner at the pointer, flipped above it when there is no room below. The first item takes
  focus on open; Escape and a click on an item close the menu and return focus to the element that
  had it; a press outside closes it too. The region is a polymorphic element (`component`,
  `asChild`) and takes `visible`/`defaultVisible`/`onVisibleChange`, `onShow`/`onHide`, `autoClose`
  as `Menu`'s, and `disabled`, which leaves the region to the browser.

  `MenuList` no longer writes `aria-labelledby` when it is given an `aria-label` of its own, which
  that attribute would have outranked, nor when there is no trigger to point at.

- d60c013: `Grid` and `GridItem` are the grid of the library, on the CSS grid of `@chassis-ui/css` 0.6. `Row`
  and `Col` are deprecated with the flexbox grid they render.

  Breaking: `@chassis-ui/css` 0.6 is required (the peer range is `>=0.6.0 <0.7.0`). The components
  below render classes that 0.5 does not have, so on 0.5 a `GridItem` is one track wide and a
  `Skeleton` with a `span` has no width. In css 0.6 the gap of a grid with no `gap` is the gutter of
  the breakpoint, from 0.5rem on a phone to 3rem on the widest screens, where it was 1.5rem.

  - `GridItem` renders `col-span-{n}` and `col-start-{n}`, where it rendered `g-col-{n}` and
    `g-start-{n}`. `span="full"` spans the row (`col-span-full`): an item with no `span` is one track
    wide, so a column that stacks below a breakpoint is `span="full" responsive={{ md: { span: 6 } }}`.
    `start="auto"` returns an item to the flow at a wider breakpoint. `rowSpan` and `rowStart` place
    it on the rows (`row-span-{n}`, `row-start-{n}`). `responsive` takes all four.
  - `Grid` takes `responsive`, as `Flex` does: `columns` at a breakpoint renders `grid-cols-{n}` (1
    to 12) and `gap` renders `gap-{token}`. The `GridLayout` type is exported.
  - Breaking: `columns` from 1 to 12 renders the `grid-cols-{n}` class on `Grid`, where it set
    `--cx-grid-columns`. The grid has the same columns. A grid nested in it no longer inherits the
    count, as it did through the custom property: a `Grid` inside `<Grid columns={1}>` has its own
    12 columns again. A count with no class (13 and up) still sets `--cx-grid-columns`.
  - Breaking: a `Spacing` token in `gap` renders the `gap-{token}` class on `Grid` and on a `subgrid`
    item, where it set `--cx-grid-gap` to the token's custom property. The gap is the same. A grid
    nested in it no longer inherits it, since a class is not inherited as the custom property was:
    give a nested grid, and a `subgrid` item, the `gap` of its own. A raw value (`gap="1rem"`) still
    sets `--cx-grid-gap`.
  - `Grid fill` takes `min`, the minimum column width (`--cx-grid-min`), below which the children
    wrap. Its raw `gap` sets `--cx-grid-gap`, where it set `--cx-gap`.
  - `Skeleton` and `SkeletonLoader` take the same `span`, `responsive` and `spans` values and render
    width utilities where they rendered the classes of the flexbox grid: `w-{n}/12` for a count,
    `w-100` for 12, `w-auto` for `'auto'` and `flex-fill` for `true`. The widths are the same. At a
    breakpoint, 12 and `'auto'` render `{breakpoint}:w-100` and `{breakpoint}:w-auto`, which
    `@chassis-ui/css` 0.6.0 does not have: in `responsive`, use a count up to 11, or `true`.
  - `Row` and `Col` still render `.row` and `.col-*` and work as before. They are marked
    `@deprecated` and warn once in development. `@chassis-ui/css` removes its flexbox grid in 0.7,
    and they go with it.

  To move from `Row` and `Col`:

  | Before                                                | After                                                              |
  | ----------------------------------------------------- | ------------------------------------------------------------------ |
  | `<Row>`                                               | `<Grid>`, with no `Container` needed around it                     |
  | `<Col span={4}>`                                      | `<GridItem span={4}>`                                              |
  | `<Col span={12}>`                                     | `<GridItem span="full">`                                           |
  | `<Col span={12} responsive={{ md: { span: 6 } }}>`    | `<GridItem span="full" responsive={{ md: { span: 6 } }}>`          |
  | `<Col span={4} offset={2}>`                           | `<GridItem span={4} start={3}>`, exact for the first item of a row |
  | `<Col order="first">`                                 | `<GridItem className="order-first">`                               |
  | `<Row>` with bare `<Col>`s, equal columns             | `<Grid fill>` with plain children                                  |
  | `<Row cols={3}>` with bare `<Col>`s                   | `<Grid columns={3}>` with plain children                           |
  | `<Row cols={1} responsive={{ md: { cols: 3 } }}>`     | `<Grid columns={1} responsive={{ md: { columns: 3 } }}>`           |
  | `<Row gutter="md">`                                   | `<Grid gap="md">`                                                  |
  | `gutterX`, `gutterY`                                  | `className="column-gap-{token}"`, `className="row-gap-{token}"`    |
  | `<Col span="auto">`, columns as wide as their content | `<Flex gap="md">` with plain children                              |

- 074f61f: `DatePicker` and `DateRangePicker` take a time: `granularity` (`day`, `hour`, `minute`, `second`)
  adds the time segments to the field, and the value becomes a `CalendarDateTime`, or a
  `ZonedDateTime` from a zoned `value`, `defaultValue` or `placeholderValue`. Also `hourCycle`,
  `hideTimeZone`, `placeholderValue` and `shouldForceLeadingZeros`, as on `TimeField`. Picking a day
  in the calendar keeps the time; an empty field takes the time and zone of `defaultValue` (single
  selection only), else `placeholderValue`, else midnight with no zone, so a controlled zoned value
  needs a zoned `placeholderValue` to stay zoned once cleared. The hidden input of `name` holds the
  date and time, and a `ZonedDateTime`'s zone.

  Both pickers now show a value outside `minValue`/`maxValue`, on an unavailable date, or a range
  that ends before it starts as invalid, with `invalidFeedback`, as `TimeField` does; `valid` gives
  way to it. `invalid` now also reaches the segments as `aria-invalid`.

  `Calendar` and `RangeCalendar` take `defaultFocusedValue`, the date they first show; the pickers
  pass their `placeholderValue`. Their "today" is the value's time zone's for a `ZonedDateTime`, as
  react-aria's label for the day already was, rather than always the browser's.

  A field given `invalidFeedback` or `validFeedback` is wrapped in its `.form-field` before the
  feedback shows, not only once it does: moving the control into the wrapper remounted it, and a
  `TimeField` typed out of its range lost focus. The ", " between a date and its time renders as
  plain text, like the space before AM/PM; a date's own literals keep their spacing.

- 5d6e2e8: Add `Divider`: the line chassis-css draws with its reboot's `<hr>`, and with `.vr` when
  `orientation="vertical"`. Children become a label in the line ("or" between two ways to sign in),
  placed with `labelPlacement` (`start`, `center`, `end`), which names the separator for screen
  readers. An `<hr>` by default, a `<div role="separator">` when vertical or labelled; `component`
  and `asChild` render any other element as the separator. Also a subpath: `@chassis-ui/react/divider`.

  The label, the vertical line and the line on elements other than `<hr>` are in
  `@chassis-ui/react/style.css`. The color, thickness, opacity and margin of the line, and the color,
  size and gap of the label, are custom properties (`--cx-divider-color`, `--cx-divider-size`, ...),
  defaulting to chassis-css's values for `<hr>` and `.vr`; a divider inside a menu takes the menu's.

  Also: `@chassis-ui/react/style.css` now opens with chassis-css's layer order, so it works imported
  before or after chassis-css's stylesheet. And under `asChild`, an element's own `aria-label` keeps
  naming it where the component would name it with `aria-labelledby`.

- df988a6: Add `NavOverflow`, chassis-css's nav overflow (the Priority+ pattern): wrap a `Nav`, a `NavbarNav`
  or the `TabList` of a `Tabs`, and the items that don't fit its width move into a menu behind a
  "More" toggle. It follows the width of its container, measures before the browser paints, and
  keeps the items in their order. The active item and the item that has focus stay in the list, and
  so does an item that isn't a link. A link in the menu is a `MenuItem` with the link's own props,
  so `onClick` and a router link given with `asChild` keep working there. Options as chassis-css's
  plugin names them: `threshold`, `collapseBelow`, `moreText`, `moreIcon`, `iconPlacement`,
  `menuPlacement`, plus `moreLabel`, `menuContainer` and `onOverflow`. Also a subpath:
  `@chassis-ui/react/nav-overflow`.

  The server renders every item; see "What the server renders" in the SSR guide for the first paint.

  With it:

  - `NavItem` and `Tab` take `keepVisible`, to keep an item out of the menu. `NavItemProps` is
    exported.
  - `Tabs` finds its `TabList` inside the element that holds it, so the list can sit in a
    `NavOverflow` or in an element of your own beside other controls.
  - `MenuToggle` takes `caret={false}` for a toggle without the caret, and keeps a `tabIndex` it is
    given, which react-aria's used to replace.
  - `IconProvider`'s `icons` takes `more`, the toggle's icon.

- 8f100c9: `Nav` and `TabList` take `variant="segments"`, the segmented control that `@chassis-ui/css` 0.6
  made of the pills: it renamed `.nav-pills` to `.nav-segments` and restyled it, with the colors,
  padding, corner radius and shadow of the design tokens.

  Breaking: `variant="pills"` renders `nav-segments`, where it rendered `nav-pills`, a class css 0.6
  no longer has. It is deprecated and warns once in development: write `variant="segments"`. A
  selector of your own on `.nav-pills` no longer matches, and the `--cx-nav-pills-*` custom
  properties are `--cx-nav-segments-*` in css 0.6.

  css 0.6 also renamed `.card-header-pills` to `.card-header-segments`, a class an app writes itself
  on a `Nav` in a `CardHeader`: `<Nav variant="segments" className="card-header-segments">`.

  Also new on `Nav` and `TabList`:

  - `size="sm"` and `size="lg"`, the nav sizes of css 0.6 (`.nav.sm`, `.nav.lg`), which scale the
    padding, gap, icon and font of the links in every variant.
  - `variant="underline"` (`.nav-underline`), which underlines the active link.

- 8ca316e: Add `NumberField`, a text input for numbers on react-aria's `useNumberField`: increment and
  decrement buttons, the arrow keys, Page Up and Page Down, Home and End for `min` and `max`, and
  `step`, which a typed value snaps to. `formatOptions` (`Intl.NumberFormat`'s) shows decimals,
  percents, currencies and units in the locale's format while `value` stays a number; `onChange`
  gets the number, `NaN` when empty. `label`, `help` and the validation props as on `TextInput`, and
  `adornStart`/`adornEnd`. With `name`, a form receives the number. `stepButtons={false}` leaves the
  buttons out; their icons are `IconProvider`'s new `increment` and `decrement`, or `incrementIcon`
  and `decrementIcon`. Also a subpath: `@chassis-ui/react/number-field`.

  The step buttons' styles are in `@chassis-ui/react/style.css`, and read `.form-input`'s own
  padding, border and colors. On a phone, the server's HTML asks for the numeric keyboard, and the
  field picks the one with the keys it needs (a minus sign, a decimal separator) once hydrated.

- 71f2d2b: Every component that takes `href` follows one rule: it renders an `<a>` when `href` is set, unless
  `component` or `asChild` chose the element, and `href` reaches only an element that can take it.

  - `ListItem` and `StepperItem` render an `<a>` for `href` alone. They used to stay an `<li>` with an
    `href` attribute and no link. `List` and `Stepper` render a `<div>` around such an item in place
    of the `<ul>` or `<ol>`, as they already did for `component="a"`.
  - `CloseButton` renders an `<a>` for `href` alone. It used to drop `href` unless `component="a"` was
    passed as well.
  - `MenuItem` without `href` renders a `<button type="button">`, which chassis-css styles as
    `.menu-item` too. It used to render an `<a>` with no `href`, which can't take focus.
  - A router link passed as `component` gets `href` from `PaginationItem` and `CloseButton`. They used
    to drop it.
  - A router link passed as `component` with `href` (or `to`) is handled as a link, as it already was
    as the `asChild` element. When disabled, it gets `aria-disabled` and `tabindex="-1"` and its click
    is blocked; it used to stay focusable and navigate, and `Button`, `Avatar` and `CloseButton` wrote
    an invalid `disabled` attribute onto the `<a>`. `ListItem` gets `list-action`, `CloseButton` its
    classes, and `List` and `Stepper` render a `<div>` around such an item.
  - `href` is no longer written onto an element that can't take one: `component="div"` or
    `component="button"` on `Button`, `Chip`, `Avatar`, `NavbarBrand`, `Link` and the components built
    on it. The component warns in development instead.
  - `Nav` no longer puts `role="navigation"` on its `<ul>`, which took away the list's semantics. Put
    a `<nav>` around it for the landmark.
  - `NavItem` renders its `NavLink` for `component` or `asChild` as well as `href`. Without a link it
    no longer writes `active`, `disabled` or `component` onto its `<li>` as attributes.
  - `Avatar` no longer writes a `disabled` attribute onto its `<span>`.
  - `MenuToggle` with `href` renders `<a role="button">` without a `type`, and `component="button"`
    renders a `<button>` without a redundant `role`.

  The ref types of `ListItem`, `StepperItem`, `CloseButton` and `MenuItem` accept the element `href`
  switches to, as `Button`'s already did.

- 9ce6aba: Every component that shows and hides takes its state under three props: `visible` is controlled,
  `defaultVisible` is the initial state of an uncontrolled component, and `onVisibleChange(visible)`
  reports each change the component asks for. `Popover`, `Tooltip`, `Menu`, `Modal`, `Drawer`,
  `Toast`, `Notification`, `DatePicker` and `DateRangePicker` take all three, and a state setter fits
  the callback as it is: `visible={open} onVisibleChange={setOpen}`.

  Breaking: `visible` on `Popover`, `Tooltip`, `Menu`, `Toast` and `Notification` is now controlled.
  It used to be copied into the component's own state whenever it changed, so the component still
  opened and closed itself in between and a parent could not hold it closed. Now the component
  shows and hides only when `visible` changes; its trigger, the Escape key, a click outside, a close
  button and the `autohide` timer are requests, reported to `onVisibleChange`. TypeScript does not
  flag the difference, so check each use:

  - `visible` as the initial state (`<Popover visible>`, `<Toast visible autohide>`): use
    `defaultVisible`.
  - `visible={open}` with `onShow` and `onHide` setting `open`: use `onVisibleChange={setOpen}`.
    `onShow` and `onHide` fire when the component has shown or hidden, which under `visible` happens
    only after the state changed.
  - `<Toast visible={open} onClose={() => setOpen(false)}>`, and the same on `Notification`: use
    `onVisibleChange={setOpen}`. `onClose` fires after the toast has hidden.
  - `<Tooltip visible onShow={...}>`: `onShow` no longer fires for a tooltip that is shown when it
    mounts, as it never did on `Popover` and `Menu`. It reports a change, and there was none.

  In development, a request that is dropped because `visible` is set and there is no
  `onVisibleChange` warns once. `Modal` and `Drawer` behave as before: `visible` with `onClose` is
  still complete, and `defaultVisible` adds a dialog that is open at first and closes itself.
  `Collapse` is unchanged and takes `visible` only.

  Also in this release:

  - `DatePicker` and `DateRangePicker` take `visible`, `defaultVisible` and `onVisibleChange`.
    `isOpen`, `defaultOpen` and `onOpenChange` still work, are deprecated, and warn in development.
  - `Popover` and `Tooltip` pass every other attribute to their panel: `className`, `style`, `id`,
    `data-*`, event handlers. They forward a ref to it. They used to accept `aria-label` and
    `aria-labelledby` only (`Popover`) or nothing (`Tooltip`). A caller `id` is the one the trigger's
    `aria-controls` or `aria-describedby` points to.
  - `MenuToggle`'s `variant` is typed as `Button`'s, so `variant="link"` is accepted (#38).
    Breaking: `variant="solid"` no longer type-checks, as on `Button`, where it is the look with no
    variant.
  - `ToastContent`, the options of `addToast`, covers every `Toast` prop that `Toaster` passes on:
    `role`, `closeButton`, `closeLabel`, `message`, `title`, `icon`, `time` and `footer` are new
    (#39). `children` is optional, so a toast can be queued from the shorthand props alone.

- c4d2adb: Declare `@chassis-ui/css` as a peer dependency (`>=0.6.0 <0.7.0`), so a mismatched version warns
  at install instead of silently collapsing spacing after a token rename.

  Breaking: `react` and `react-dom` narrow from `>=18` to `^19.0.0`. React 19 is the version the
  package is tested on. On React 18, part of its own test suite and its type check fail.

  The build now ships source maps with the original TypeScript embedded, so stack traces and
  debuggers show the source instead of minified code. `src/` is no longer published, since the maps
  carry it. Tarball: 565 files, 330.6 kB packed, 1,261 kB unpacked before; 356 files, 361.9 kB
  packed, 1,391 kB unpacked after.

- badd481: Three additions for server-rendered apps and accessible markup:

  - `Portal` renders its children into `document.body` or a `container` you give, and renders
    `fallback` (nothing by default) on the server and during hydration, so a server-rendered page
    hydrates without a mismatch. It is what the library's own overlays use.
  - `useHydrated()` is `false` on the server and during hydration, `true` after, for rendering what
    only the browser knows.
  - `VisuallyHidden` renders chassis-css's `.visually-hidden` (a `<span>` by default, with
    `component` and `asChild`), or `.visually-hidden-focusable` with `focusable`, for a skip link.

  Each is also a subpath: `@chassis-ui/react/portal` and `@chassis-ui/react/visually-hidden`.

- 2aac59e: Every component that renders an element of its own now forwards a ref.

  - `Autocomplete`: to the toggle, the `.combobox` element, as `Combobox` does.
  - `PasswordStrength`: to the meter. It reached it before only by accident, and TypeScript rejected
    it.
  - `FormField`: to the `.form-field` element. `null` while the field renders its children bare,
    with no `label`, `help`, feedback or `className`.
  - `SkeletonLoader`: to the first generated skeleton while `loading`, `null` once the content
    shows.

  `Tooltip` and `Popover` render their trigger the way `asChild` renders a child. A trigger's own
  `aria-describedby` now keeps the tooltip's description beside it instead of losing to it, and a
  trigger that isn't exactly one element renders as it is, with a development warning, instead of
  throwing. The trigger's own handlers now run after the component's, as under `asChild`.

  Under `asChild`, a child's own `aria-describedby` adds to the component's instead of replacing it.

- 4a2bf4c: Add `Scrollspy`, chassis-css's scrollspy: wrap a navigation whose links point to sections of the
  page, and the link to the section being read gets `.active` and `aria-current="true"`, in the
  viewport or in an element that scrolls (`root`). The links are `Link` and the components built on
  it (`NavLink`, `NavItem`, an interactive `ListItem`, `MenuItem`), with `href` on the component or,
  under `asChild`, on its element. The link a nested `Nav` follows and the toggle of a menu are
  marked too, as the plugin marks them. Options: `rootMargin`, `smoothScroll` (instant under
  reduced motion), and `onActiveChange` for the plugin's `activate` event. Also `useScrollspy(ids,
options)`, which returns the active section's id, and a subpath: `@chassis-ui/react/scrollspy`.

  The active section is the last whose top has passed a line near the bottom of the scrolling area,
  or the first while it is still in view at the top: the same position always marks the same link,
  whichever way the page scrolled. Sections rendered later are found without a `refresh` call. The
  server marks no link; see "What the server renders" in the SSR guide.

- bae995a: `SearchField`: a native `<input type="search">` on react-aria's `useSearchField`, in chassis-css's
  input adorn shape, a `.form-input.search-field` around a `.ghost-input` with a search icon at its
  start and, while there is a value, a clear button. The button and the Escape key empty the field
  and keep focus on the input; Escape in an empty field reaches the dialog or menu around it.
  `onSubmit` receives the value on Enter, with any modifier key and in a read-only field too, instead
  of the form submitting; without it the field submits its form under `name`. It takes `label`,
  `help`, the validation props, `size`, `disabled` and `readOnly` like the other form fields,
  `searchIcon` (`false` leaves it out), `clearIcon` and `clearAriaLabel`. Two icon purposes join
  `IconProvider`'s `icons`: `search` (`search-outline`) and `clear` (`xmark-outline`).

  Its styles, in `@chassis-ui/react/style.css`, hide the browser's own clear button, and give the clear
  button the field's icon color and the close button's idle and hover opacity
  (`--cx-close-button-idle-opacity`, `--cx-close-button-hover-opacity`). A field disabled by its
  `<fieldset>` hides the button too.

- 1387cde: Add `TimeField`, a time of day on react-aria's `useTimeField`: one editable segment per unit, as
  the field of `DatePicker` renders a date, typed into or stepped with the arrow keys, in the
  locale's format (12 or 24 hours, the order of the units, right to left). `granularity` (`hour`,
  `minute`, `second`), `hourCycle`, `minValue`/`maxValue` (a time outside shows the field invalid
  with its `invalidFeedback`), `placeholderValue`, `hideTimeZone`, `shouldForceLeadingZeros`.
  Values are `Time`, `CalendarDateTime` or `ZonedDateTime`; with `name`, a form receives an ISO 8601
  time, and a form reset restores `defaultValue`. `label`, `help` and the validation props as on the
  other fields. Also a subpath: `@chassis-ui/react/time-field`.

  The segments' styles are the date pickers', in `@chassis-ui/react/style.css`. The date pickers'
  segments are laid out inline now, so a time in a right-to-left locale reads left to right, and a
  read-only segment no longer writes `contenteditable="false"` beside `aria-readonly`.

- 5457b3d: `Tree` and `TreeItem`: a tree of expandable items, on react-aria-components' `Tree`. Items are
  written as nested `TreeItem` elements, or rendered from data with `items` and a render function on
  the tree and on any item, as `DataGrid`'s body is. An item with child items has a chevron that
  expands and collapses it, as the arrow keys do; `expandedKeys`/`defaultExpandedKeys`/
  `onExpandedChange` hold which items are expanded, and the server renders the expanded ones.
  `selectionMode` allows one item or several to be selected, with a checkbox per item for multiple
  selection (`checkboxes` turns it on or off), and `selectedKeys`/`onSelectionChange`,
  `disabledKeys`, `disallowEmptySelection` and `selectionBehavior` as on `DataGrid`. Enter, or a
  click in a tree with no selection, calls `onAction`, and `renderEmptyState` fills an empty tree.
  The keyboard
  moves between items with the arrow keys, Home and End, and finds one by typing its text.

  `Tree.scss` styles the rows, in `dist/style.css`: indentation per level (`--cx-tree-indent`), the
  chevron, and the hover, selected and disabled states, read from `.list`'s and `.menu`'s custom
  properties. The chevron is `IconProvider`'s new `expand` icon, or the tree's `expandIcon`.

### Patch Changes

- 98e8cb9: Fix `asChild` dropping the component's own handling of the element it renders. A component now
  treats its child as it treats the same element passed to `component`, so
  `<Button asChild disabled><a href="/login">` renders what `<Button component="a" href="/login"
disabled>` renders.

  - `Button`, `Link`, `NavLink`, `CardLink`, `MenuItem`, `Chip`, `PaginationItem`, `Avatar` and
    `ListItem`, when `disabled` with a link child: the link gets `aria-disabled="true"` and
    `tabindex="-1"` and its click is blocked, including the child's own `onClick`. It used to get
    an invalid `disabled` attribute, or only a class, and still navigated.
  - `CloseButton` with a link child keeps its `close-button` classes and its `Close` label.
  - `ListItem` with a link or `<button>` child gets `list-action`, and `List` renders a `<div>`
    around it instead of a `<ul>`. `Stepper` does the same for a `StepperItem`.
  - `List` and `Stepper` with a `<ul>`/`<ol>` child of their own keep rendering `<li>` items.
  - `Placeholder` renders its child as the image. It used to ignore the child and render the
    generated graphic.
  - A plain tag as the child, such as `<div>`, gets what `component="div"` gets: `Button` and
    `CloseButton` add `role="button"` and keyboard activation.

  A component element with an `href` or `to` prop, such as a router's `<Link>`, counts as a link.
  Any other component element is still trusted with its own semantics, as with `component={...}`.

- ee7c273: Fixes in `Calendar`, `RangeCalendar`, `DatePicker` and `DateRangePicker`:

  - With `visibleMonths` above 1, a day in the weeks of two visible months showed as a day of both:
    selected, focusable and selectable twice, and a range drew its band over it in each grid. It is
    now a day of its own month only, and greyed out in the other, as it is with one month.
  - A range's endpoint kept its highlight in the grid of the month next to its own, and the band
    stopped square beside a day it can't hold (an unavailable or disabled one, another month's). The
    endpoint is highlighted in its own month only, and the band is capped wherever it breaks.
  - Pressing a greyed-out day while selecting a range ended the selection at the last day hovered.
    The press now does nothing, and the selection stays open.
  - Tab stopped on every day that can't be focused: the days of another month, and the ones outside
    `minValue`/`maxValue`. It leaves the grid from the focused day.
  - A calendar no longer takes focus when it mounts under `StrictMode`.
  - With `visibleMonths` above 1, picking a month or year, or backing out of that view, in a block
    other than the one holding the focused day dropped focus to the document body, out of a
    picker's popover. The block's month or year button takes it.
  - The global previous/next buttons stayed hidden once `visibleMonths` was lowered while a removed
    block was showing its month or year view.
  - The year view repeated an era's first year when paged back past it, in a calendar with eras
    (`ja-JP-u-ca-japanese`). It now crosses into the era before.
  - `RangeCalendar`'s `presets` are disabled with the calendar; they used to select a range on a
    `disabled` one. A preset now drops a selection begun in the grid, which stayed pending and was
    finished by the next day pressed, and moves the calendar to a range that starts outside the
    visible months.
  - `unavailableDates` now marks a value with a time (`granularity`) invalid. Only date-only values
    matched its `YYYY-MM-DD` entries.
  - `labels.calendar` names the calendar button of `DatePicker` and `DateRangePicker`. It was read
    only with `selectionMode="multiple"`.
  - `DatePicker` with `selectionMode="multiple"` shows a `ZonedDateTime` on its own day, not the day
    its instant falls on in the viewer's time zone.

- 4e4bd7b: `Modal`, `Drawer` and `Alert` rendered with `open` stay open. They used to close themselves right
  after mounting (and after hydration, in a server-rendered page), firing `onHidden`, because their
  state started closed. `open` is now the initial state when neither `visible` nor `defaultVisible`
  is set: the dialog is open from the first paint, server HTML included, as a non-modal dialog, and
  stays open until a close request.
- 913b42f: Fix what server-rendered HTML shows before the page hydrates. Each component now renders on the
  server what it settles to in the browser.

  - `Tabs` with neither `selectedKey` nor `defaultSelectedKey` selects its first enabled tab and
    renders that tab's panel on the server. That tab is the tab stop, so Tab reaches the list before
    hydration.
  - A `Toast` or `Notification` shown on its first render is rendered with `show` and hydrates
    without replaying its enter transition; `onShow` still fires once. One mounted later animates in
    as before.
  - `Carousel` renders its indicators and marks its active slide on the server, so a
    `transition="fade"` carousel is no longer blank until hydration, and its end controls start in
    the right state. Slides get `role="group"`, which their `aria-label` requires.
  - A `Menu` open on its first render shows its list once it has a position, instead of at the top
    left of the page. A closed `Menu` or `MenuSubmenu` list no longer has `aria-hidden`: chassis-css
    hides it.
  - `Calendar` and `RangeCalendar`, and the date pickers' calendars, mark today after hydration, in
    the browser's time zone instead of the server's.
  - Fields no longer refer to ids that don't exist in the server's HTML: `TextInput`, `Textarea`,
    `Checkbox`, `Switch`, `Radio`, `CheckboxGroup`, `RadioGroup`, `ChipInput`, `OtpInput`,
    `DatePicker`, `DateRangePicker` and the selection checkboxes of `Table` and `DataGrid`. The
    triggers of a `Popover` or `Tooltip` open on first render get `aria-controls` or
    `aria-describedby` once the overlay exists.
  - `Table` and `DataGrid` no longer write an empty `aria-describedby`, an empty `DataGrid` no longer
    writes a negative height, and an empty `ChipInput` no longer writes `aria-multiselectable` on its
    `group`.
  - A masked `OtpInput` gives every box `autocomplete="one-time-code"`. Browsers ignore `off` on a
    password field, so they offered saved passwords in each box.

- 45bff89: `TextInput`, `Textarea`, `NumberField`, `Checkbox`, `Radio`, `Switch`, `RadioGroup` and `TabList`
  render the attributes and event handlers their props accept. They are built on react-aria hooks,
  which return only the props they know, so `title`, `dir`, `lang`, `accessKey`, most `aria-*`
  attributes, `onClick`, `onMouseEnter` and the other pointer handlers never reached the element,
  `tabIndex` was always `0`, `required` was dropped, and `NumberField` ignored `autoComplete` for
  `"off"`. A handler the hook runs itself, such as `onFocus` or `onKeyDown`, still runs once.
  `Radio` keeps its group's `name` and its roving `tabIndex`. A `Checkbox` or `Radio` given
  `autoComplete`, which HTML doesn't allow on a checkbox or radio, now renders it; the docs'
  toggle-button examples, which passed `autoComplete="off"`, no longer do.

  `style` goes on the outermost element, as `className` does: the `.form-input` wrapper of a
  `TextInput` with an adorn, and the `.form-check` label of a `Checkbox`, `Radio` or `Switch`.
  `TextInput`, `Checkbox`, `Radio` and `Switch` used to drop it, and `Switch` with `type="radio"`
  put it on the input.

- ca154a2: Fix hydration errors from portaled overlays. `Combobox` and `Autocomplete` always failed to hydrate,
  as did `FormField` around a `Combobox` and a `Popover` open on first render: their overlay was
  portaled on the client's first render but not on the server. Every portal (`Combobox`,
  `Autocomplete`, `Popover`, `Tooltip`, `Menu`'s `container`, `MenuSubmenu`, and `Toaster` with
  `placement`) now renders nothing on the server and during hydration, and portals once hydration
  has finished. A `Toaster` with `placement` no longer renders inline on the server.
- 379c3b9: `ListItem` rendered as a link or button no longer writes its `active` and `disabled` classes
  twice, and a disabled button item no longer carries `aria-disabled` next to its own `disabled`
  attribute. `Link`, which renders interactive items, already sets both.
- 626f373: Remove the `react-transition-group` dependency. `Collapse`, `TabPanel`, `Toast`, `Notification`,
  `Tooltip` and `Popover` apply the same chassis-css classes in the same order as before.

  - A transition now lasts as long as the element's own CSS transition, as it already did for
    `Modal`, `Drawer` and `Menu`, instead of a duration fixed in the component. A theme that changes
    a transition's duration is followed, and so is `prefers-reduced-motion`.
  - Fix a queued toast coming back after it was closed (#40). A `Toast` or `Notification` that
    unmounts before its exit transition has finished now calls `onClose` as it unmounts. A `Toaster`
    remounted by a navigation, such as a Server Action that redirects, no longer shows the toast
    again.
  - A newly selected `TabPanel` starts to fade in as soon as it is in the page. It used to wait
    150 ms at full transparency first.
  - `Collapse` keeps a `style` passed to it while it animates. The `style` used to replace the size
    the transition needs, so the transition didn't run.

- 5a81190: Fix components that read their children when those children are written in a React Server
  Component.

  - `Tabs` rendered an empty tab list, `List` and `Stepper` rendered an `<a>` directly inside
    `<ul>`/`<ol>`, and `Combobox` and `Autocomplete` listed no options. In a Server Component a
    client component's element carries a lazy wrapper as its type, so the components didn't
    recognize their own parts. This happened in production builds.
  - `asChild` rendered the component's default element around the child and failed hydration, and
    `Tooltip` and `Popover` threw "Cannot read properties of undefined (reading 'ref')", when the
    child held something still loading, such as a client component passed by reference (#37). This
    happened under `next dev`.
  - An icon element passed to `IconProvider` or to a component's icon prop could throw the same way.

  A component that reads a child now waits for it when it is still loading, as a lazy component
  does. `Table` still can't be composed in a Server Component; use `StaticTable` there.

- a15fcd4: `Calendar` and `RangeCalendar`, and the date pickers' calendars, no longer call a day "Today" in its
  label in server-rendered HTML. react-aria writes "Today, …" into a cell's `aria-label` with the
  server's date and time zone, and hydration doesn't patch attributes, so a statically built page
  named its build day as today until the cell re-rendered. Until hydration a cell's label is now
  react-aria's for a day that isn't today, in the same locale ("Thursday, October 1, 2026 selected");
  once hydrated it is react-aria's own, "Today" included, on the same day the `datepicker-date-today`
  class and `aria-current="date"` mark.
- 9e4f450: `ButtonGroup vertical` stacks its buttons. It rendered `button-group vertical`, a pair of classes
  `@chassis-ui/css` has no rule for, so the group stayed a row; it renders `button-group-vertical`
  now, the class of the framework, in place of `button-group`. `size` has no effect on a vertical
  group, as in the framework: size its buttons themselves.

  `RadioGroup` and `CheckboxGroup` with `orientation="horizontal"` wrap their items onto further
  lines when the container is too narrow for one. They overflowed it.

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
