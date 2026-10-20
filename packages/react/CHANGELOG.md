# @chassis-ui/react

## 0.5.0

### Minor Changes

- 7d76ef8: Breaking: `@chassis-ui/css` 0.11 is required (the peer range is `>=0.11.0 <0.12.0`), and a project
  that compiles its Sass needs `@chassis-ui/tokens` 0.10.1. No prop, export or class name of this
  package changes; css 0.8 to 0.11 change how a page looks with no change of markup. Headings and the
  title roles are set in Montserrat, the base colors of the default tokens are new, and buttons,
  badges, chips, pagination links, progress bars and the other components that had one lose their
  background gradient (`$enable-background-gradients: true` keeps it). The font family of
  components is named `ui`: `.font-ui` and `--cx-font-family-ui`, where `.font-text` and
  `--cx-font-family-text` are deprecated. `.h1` to `.h6` are deprecated for `.font-h1` to
  `.font-h6`. An SVG icon in a `Link` with `iconLink` is drawn at `1em` of the link text instead of
  `--cx-icon-size` (24 px with the default tokens); a size class such as `.icon-lg` on the icon makes
  it larger. Blockquotes are Regular Italic instead of Light Italic. The changelogs of
  `@chassis-ui/css` 0.8.0 to 0.11.0 have the full list.

  - `style.css` is built with css 0.11 and reads the custom properties of the `ui` family, such as
    `--cx-font-family-ui`, `--cx-font-size-ui-sm` and `--cx-font-weight-ui-strong`, which css 0.7
    doesn't declare. The default of `--cx-divider-label-font-size` is `var(--cx-font-size-ui-sm)`,
    the size it had.

- 36a439b: Fixes to the carousel, the time field, range presets, list items and the scrollspy, and two values that no longer render a class.

  - `Carousel`:
    - A controlled carousel (`activeIndex`) is fed from `onSlide`. The docs and the development warning also offered `onSlid`, which cannot do it: it fires once a slide has arrived, and a controlled carousel doesn't leave for one until `activeIndex` names it. The warning now fires when `onSlide` is missing, with or without `onSlid`.
    - When the parent of a controlled carousel doesn't follow a swipe, the track scrolls back to the active slide once the swipe has been at rest for half a second, which leaves a parent that follows late the time to. It stayed on the slide the user had swiped to, and the next step that was followed didn't scroll.
    - `onSlid` reports the slides `activeIndex` moved between when the parent chose the slide itself, or answered a request with another one. It reported the last step the carousel had asked for.
    - Autoplay under `ends="stop"` is over when it arrives at the last slide. It waited one more interval there, with the indicator filling and `CarouselPlayPause` reading Pause.
  - Breaking: an empty `TimeField` with `required` holds its form back from submitting, and its first segment takes focus. `required` was `aria-required` alone and `form.checkValidity()` was `true`. A form that should submit anyway needs `noValidate`.
  - Breaking: a preset of `RangeCalendar` or `DateRangePicker` with an unavailable day in its range is disabled, as the grid can't select a range across one. It was committed as given.
  - A `ListItem` whose `component` or `asChild` element is a component, such as a router link, stays mounted when its `href` comes and goes. It was remounted, and lost its state and focus.
  - `Scrollspy` and `useScrollspy` mark the last section once the scrolling area is at its end. A last section shorter than the area below the activation line never became the active one.
  - Breaking: `CardImage` renders no class for an `orientation` that `@chassis-ui/css` has none for, and warns in development: `top` or `bottom` at a breakpoint, and any value at `2xl`. It rendered a class with no rule, such as `md:card-image-top`, which did nothing unless your own CSS defined it.
  - Breaking: `Skeleton` renders no width class for a `span` that isn't a whole number from 1 to 12, `'auto'` or a boolean, such as `0`, `13` or `'50%'`, and warns in development. It rendered a class with no rule, such as `w-13/12`.

- 9b2c9d1: `DataGrid`'s `pin="end"` columns are pinned inside the layout engine, from the column widths and positions it computes, instead of being measured from the page and moved by a `transform` afterwards.

  - An end-pinned column that nothing pushes off the grid stays where the layout put it. In a grid whose columns fit, it was moved by the grid's width and drawn past the last column; after a column narrower than react-stately's 75px minimum, it was drawn past the edge.
  - An end-pinned column is in the page at any scroll position. One further right than the grid's width plus about a third wasn't rendered until scrolled to.
  - An end-pinned header is drawn over the headers that scroll under it. It was under every header to its left.
  - `pin` is read off the column that has it, so columns in a fragment, a wrapper component or the `columns` render function of `DataGridHeader` pin as written. A header with a fragment pinned the wrong column, and the render-function form didn't pin to the end or get either scroll cue.
  - Under RTL, the end-pinned column is pinned to the left edge, and the grid takes `datagrid-scrolled-start` once scrolled.
  - Breaking: each scroll-cue shadow is on the edge content scrolls under, the trailing edge of the start group and the leading edge of the end group. They were on the outer edges. The defaults of `--datagrid-pin-cue-shadow-start` and `--datagrid-pin-cue-shadow-end` change to match, with a mirrored pair under `[dir="rtl"]`. A value of your own for either property is applied as before, on the edge its horizontal offset gives; to match the new default, flip the sign of that offset, and give `[dir="rtl"]` the opposite sign.
  - In Firefox, a `pin="start"` header stays at the edge however often the grid is scrolled. After a couple of horizontal scrolls it scrolled away with the other columns.

- 7dd8314: Fixes to form inputs, the date pickers and the combobox family.

  - Breaking: `required` is the native attribute where it was `aria-required` alone, so a form checks it: on a `NumberField`'s input, on the radios of a required `RadioGroup`, and on the checkboxes of a required `CheckboxGroup` while none is selected. `form.checkValidity()` was `true` for each of them when empty. A form that should submit anyway needs `noValidate`.
  - A `Radio` passes its `form` to its input.
  - `ChipInput` inside a `FloatingInput` is named by the floating label. It kept its fallback `aria-label` and was named "Add value Skills".
  - `OtpInput` focuses the next empty box after a partial paste. Focus went to the last filled box, where the next digit typed replaced it.
  - Breaking: `InputAdorn` with `component="button"` is `type="button"` unless `type` is given. A password reveal adorn submitted the form around it.
  - A `Checkbox`, `Radio` or `Switch` with no label applies `className`, on the `.check-input` element, where `style` already went.
  - Breaking: `Chip` writes `aria-pressed` only on a chip with the button role. A static `pressed` chip had it on a `<span>` with no role, and a chip that is a link (`href`, or an `<a>` as `component` or the `asChild` element) on its `<a>`, which axe reports for both; the `.active` class still shows it. Give a link chip `role="button"` for it to be announced as pressed, as with `Button`.
  - `Progress` keeps the caller's `aria-labelledby`.
  - `DatePicker` and `DateRangePicker` describe their segments and calendar button by the help and feedback, which reached only the group around them, and the group keeps react-aria's description of the selected date.
  - The server HTML of a `Combobox` with no options no longer describes its input by the no-results message, which exists only once hydrated.
  - `Autocomplete` leaves focus on the field the user moved to when its list closes. It always focused the toggle. `onClick`, `onKeyDown` and `onFocus` given to it run beside the toggle's own handlers; they were replaced.
  - Breaking: a preset of `RangeCalendar` or `DateRangePicker` is selected as the grid selects a range: its dates in order, kept inside `minValue`/`maxValue`, in the calendar of the current value and with that value's times. A preset with no day inside the limits is disabled.

- 92e7307: `Form`'s `validated` shows every field in the form as valid or invalid.

  - Breaking: `validated` no longer renders the `.was-validated` class. `@chassis-ui/css` has no rule for it, so a validated form showed nothing: no field looked valid, and an invalid one looked invalid only after a submit it had held back. A stylesheet that targets `form.was-validated` needs another selector.
  - Every field in a `Form` with `validated` shows itself as valid or invalid by its own constraints (`required`, `type`, `pattern` and the like), and again as its value changes: its class, `aria-invalid`, and its `validFeedback` or `invalidFeedback` (`errorMessage` on a group). Set `invalid`, to `false` too, or `valid` on a field, and that prop decides how the field looks instead. This holds for `TextInput`, `Textarea`, `SearchField`, `NumberField`, `Select`, `FileInput`, `ColorInput`, `RangeInput`, `Combobox`, `Autocomplete`, `OtpInput`, `ChipInput`, `Checkbox`, `Switch`, `RadioGroup`, `CheckboxGroup`, `TimeField`, `DatePicker` and `DateRangePicker`. A control that isn't one of these, such as a plain `<input className="form-input">`, isn't affected.

- 2a52f70: Fixes to form fields, `Navbar`, `Carousel` and a few small components.

  - `Autocomplete`: the search field is a query only. After a selection it held the option's text when the list opened again, what was typed went after it so nothing matched, and emptying it cleared the selection. It is now empty each time the list opens, and the selection changes only when an option is chosen.
  - `Autocomplete`: `value={null}` is a controlled empty selection, so a parent can clear the toggle. It was read as no `value`, and the selection went uncontrolled.
  - Breaking: a single `Select` with a `placeholder` and no `value`, `defaultValue` or `selected` option starts on the placeholder, and its value is `''`. The browser showed the first enabled option, which was the value, and a `required` select passed validation with nothing chosen. Give `defaultValue` for a select that should start on an option.
  - `Select`: an option of `options` with a `label`, no `value` and `selected: true` is selected. It renders with its label as its value, and the default was looked for under an empty value.
  - `OtpInput`: a form reset puts the code back once, to `defaultValue` or empty, with one `onChange`. Each box reset itself against the same code, which left "1234" as "123" and called `onChange` four times.
  - `OtpInput`: focus on a box past the first empty one moves to that box, where the next digit goes. A digit typed in the third box of `1 _ _ _` landed in the second.
  - `ChipInput` and `Combobox`: a required field that held a submit back stays marked invalid while what is typed isn't a value, and the mark goes with the chip or the option that satisfies it. The first character typed cleared the mark, and the chip that satisfied a `ChipInput` left it.
  - `ChipInput`: at `maxChips`, Enter and the separator leave the text they can't add in the input, as a paste does. They cleared it.
  - `TimeField`: a required field takes focus after a submit it held back once a `label` or `help` was given later. Focus went nowhere.
  - `RangeCalendar` and `DateRangePicker`: a preset kept inside `minValue`/`maxValue`, or given in reverse, shows as the selected preset once chosen.
  - `Switch` with `type="radio"`, `isSelected` and no `onChange` no longer logs React's warning about a `checked` input with no handler.
  - Breaking: `Navbar`'s `container` renders `container` beside its variant, `container fluid` or `container xl`, which `@chassis-ui/css` styles. It rendered `container-fluid` and `container-xl`, which have no rule, so the wrapper had no width and wasn't laid out as the navbar's row. CSS of your own written for those class names needs the new ones.
  - `Carousel`:
    - With fewer slides than the active index needs, the last slide there is becomes the active one, which a controlled carousel asks for through `onSlide`. No slide was active, Next was disabled and Prev did nothing under `ends="stop"`.
    - A controlled carousel looping from its last slide to its first fires `onSlid` once the loop has arrived. It fired as the loop began.
    - A slide's own `aria-label` is kept. The position ("1 of 3") was written over it.
    - Unmounting during a loop stops its animation.
  - `Link`: an `aria-current` given beside `active` is kept. `active` wrote `"page"` over it, as over a step's `"step"`.
  - `BreadcrumbItem` with `href=""` renders a link, to the current document.
  - `Pagination` with `pages={0}` renders its Previous and Next controls, disabled, and no pages. It rendered an empty navigation landmark.
  - `Button` and `CloseButton` pass a `type` they are given to a component reference as `component`. It was dropped.

- cd92542: Fixes to how `Modal`, `Alert`, `Drawer`, `Popover`, `Menu` and `ContextMenu` open, close and nest.

  - A `Modal`, `Alert` or `Drawer` whose `visible` goes back to `true` while its exit transition runs stays open. The end of that exit closed it, with `visible` still `true`.
  - `onClose` fires once per close. Every Escape or backdrop click during the exit fired it again.
  - A dialog the browser closes by itself (a second Escape in a row, a `<form method="dialog">`) asks to close through `onClose` and `onVisibleChange(false)`, releases the scroll lock and fires `onHidden`.
  - `onShown` fires for a dialog mounted with `visible` under `React.StrictMode`.
  - Breaking: Escape closes the innermost open overlay only. One press closed a menu, the popover it was in and the dialog around both.
  - Breaking: a press inside an overlay opened from a `Popover`, a `Menu` or a `ContextMenu` (a nested popover, a `Menu` with `container`, a picker's list) no longer counts as a press outside it. `Popover` closes on the press outside, not the click that follows, so a control that removes itself when clicked doesn't close it.
  - A submenu nested in a `MenuSubmenu` closes with it.
  - Breaking: `Menu`'s `container` puts the list in the open dialog the menu is in, and so does a `MenuSubmenu` with its panel: both went to `document.body`, behind a `Modal`'s backdrop, where a submenu could not be used. A `Menu` closes when the dialog around it does.
  - `Modal` and `Drawer` have `aria-labelledby` only when a `ModalTitle` or `DrawerTitle` is rendered, under the id the title has, and not at all when given an `aria-label`. The attribute named an id no element had when there was no title or the title had its own `id`.
  - Breaking: a `responsive` `Drawer` asks to close when the viewport grows past its breakpoint, where it stayed over a scroll-locked page.

- 513a8e8: Fixes to how dialogs, popovers, menus and toasts open, close, take focus and name themselves.

  - Breaking: `<Drawer scroll>` with its backdrop leaves the page scrollable, as `scroll` says. It locked the page whenever the drawer opened modally.
  - A `Modal`, `Alert` or `Drawer` taken out of the tree while open (`{open && <Modal visible>}`) returns focus to the element that opened it. Focus fell to `<body>`.
  - A `ModalTitle` or `DrawerTitle` with `asChild` names its dialog under the child's own `id`. The dialog's `aria-labelledby` named an id no element had.
  - Breaking: a `Popover` held open by `visible` with no `onVisibleChange` takes no Escape. On top of the open overlays it prevented every Escape, so a `Modal` under it could not close.
  - A `Popover` whose trigger is in a shadow root toggles closed when the trigger is pressed. The press closed it and the click opened it again.
  - A `Popover` with no `title` and no `aria-label` is named by its trigger (`aria-labelledby`, and an `id` on the trigger when it has none). It was a dialog with no name.
  - `Popover` and `Tooltip` fire no `onShow` or `onHide` on mount under `React.StrictMode`.
  - Breaking: a `Popover` or `Tooltip` mounts its panel once, in the dialog it is in. Content in a dialog mounted twice on its first open: its effects ran twice, its state was lost and its fade with it. One mounted open now fades in.
  - Breaking: the list of a `Menu`, `MenuSubmenu`, `ContextMenu`, `Combobox` and `Autocomplete` takes its height from chassis-css's `--cx-menu-max-height`. react-aria wrote an inline `max-height` over it. The 320px cap of a `Combobox` or `Autocomplete` list, which the components set under a name chassis-css doesn't read, now applies.
  - Overlays mounted open together take Escape innermost first. A `Modal` mounted around an open `Menu` took the key from it.
  - Breaking: a click on a `MenuToggle` closes another open `Menu`. Both stayed open.
  - Breaking: choosing a `Menu` item returns focus to the toggle, unless the item moved it elsewhere. It fell to `<body>`.
  - A `ContextMenu` inside another opens alone on a right-click or Shift+F10, and a changed `id` reaches the region and its list's label.
  - Breaking: a `MenuSubmenu` with `activation="hover"` opens on a tap on a device without hover, and a click on its trigger on a device with hover no longer closes the menu.
  - A `Toast` or `Notification` hidden while hovered or focused (its close button takes focus) dismisses itself again when shown. A `delay` a timer can't hold (`Infinity`, over 2^31 - 1 ms) runs no timer: it dismissed at once.
  - Closing a queued toast or notification from the keyboard moves focus to the next one, or back to where it was before the region. It fell to `<body>`.

- 20e97a2: `Progress` and `ProgressBar` take `indeterminate`, for work whose extent is not known: a page navigation, an upload before its size is known, a request with no progress events. The bar sweeps across the track, and `Progress` leaves out `aria-valuenow`, `aria-valuemin` and `aria-valuemax`, where it used to report "0%". `value` and `inlineValue` are ignored, and `showValue` keeps its place in the caption row empty. With `striped` the bar fills the track with its stripes instead, moving when `animated` is set. The sweep animates `transform` only, so it keeps running while the main thread is busy; under `prefers-reduced-motion: reduce` the bar shows still stripes. `--cx-progress-indeterminate-animation` replaces the animation. The styles are in `@chassis-ui/react/style.css`.
- 8e7d759: `required` on the fields that had none, fields that show the submit they held back, and `form` on the groups.

  - `DatePicker`, `DateRangePicker`, `Combobox`, `Autocomplete`, `OtpInput` and `ChipInput` take `required`. An empty one holds its form back from submitting and takes focus; a form that should submit anyway needs `noValidate`.
    - `DatePicker` asks for a date, or with `selectionMode="multiple"` for one date at least. `DateRangePicker` asks for both dates.
    - `Combobox` and `Autocomplete` ask for a selected option: text typed in a `Combobox` without selecting one is not a value.
    - `OtpInput` asks for every box.
    - `ChipInput` asks for one chip at least: text typed and not added as a chip is not a value.
  - Breaking: a field that held its form back from submitting shows as invalid, with its `invalidFeedback` (`errorMessage` on a group), until it no longer would or the form is reset. A form with an invalid field isn't submitted, and nothing said why: react-aria cancels the browser's own message for the fields it backs, and a value in an input that isn't displayed has none. Every form field does this: `TextInput`, `Textarea`, `SearchField`, `NumberField`, `Select`, `FileInput`, `Combobox`, `Autocomplete`, `OtpInput`, `ChipInput`, `Checkbox`, `Switch`, `RadioGroup`, `CheckboxGroup`, `TimeField`, `DatePicker` and `DateRangePicker`. Set `invalid`, to `false` too, or `valid`, and that prop decides how the field looks instead; a form with `noValidate` holds nothing back.
  - A `CheckboxGroup` that is no longer `invalid` takes the state off its checkboxes. They kept `aria-invalid` and `.is-invalid` once the group had been invalid, until `invalid={false}` was set.
  - A radio-backed `Switch` (`type="radio"`) with `invalid={false}` no longer renders `aria-invalid="false"`.
  - `RadioGroup` and `CheckboxGroup` declare `form`, the id of the `<form>` a group rendered outside it belongs to. It already reached every radio and checkbox through react-aria; TypeScript refused it on the group.

- e934a10: Fixes to refs and `asChild`, the navigation components and the carousel.

  - A callback ref that returns a cleanup function (React 19) has it run when the element goes away. Every component that forks your ref with its own (`asChild`, a `Tooltip` or `Popover` trigger, `Link`, `Button`) dropped the cleanup and called the ref with `null` instead. An `async` callback ref is called; it was never called.
  - Under `asChild`, the inline styles a component computes are merged with the child's own `style`, the child's winning. A child with any `style` lost them: a `Grid`'s `--cx-grid-gap`, a `GridItem`'s `grid-template-rows`.
  - A component element given to `asChild`, such as a router link, stays mounted when its `href` or `to` comes and goes. It was remounted, and lost its state and focus.
  - Two copies of the package in one page, or a hot reload of it, no longer leave `outline: none` on a pressed element for good.
  - `Tab` and `TabPanel` work with a number as `id`, as the type allows. `<Tab id={1}>` showed no panel and ignored `disabled`. `selectedKey`, `defaultSelectedKey` and `disabledKeys` take the numbers too, and `onSelectionChange` reports the `id` as the `Tab` has it.
  - An item of `List`'s `items` renders as a `ListItem` does. A disabled linked item is out of the tab order and doesn't navigate, and a linked item is marked by a `Scrollspy` around the list.
  - `NavOverflow` keeps every item of a list that has no more than `threshold` of them. It moved them all into the menu.
  - An `Accordion` item with no `id` that starts `open` is the one expanded when `onExpandedChange` is set. A different item was.
  - `Carousel`:
    - Autoplay follows `interval`, `ends`, `items`, `transition` and `onSlide` as they change. It kept those of the render it started in.
    - A controlled carousel whose parent leaves `activeIndex` where it is keeps stepping from the slide that is shown.
    - When autoplay reaches the last slide of `ends="stop"`, `CarouselPlayPause` shows Play. It is disabled on that slide while stopped, as `CarouselControlNext` is, and focus on it moves to the previous control: there is nothing left to play, and Play there ran one interval with no slide to go to. A cycle that would start on the last slide doesn't.
    - With `transition="fade"`, `onSlid` fires when the incoming slide has faded in. It fired with `onSlide`.
    - Breaking: in a right-to-left layout Left Arrow moves to the next slide and Right Arrow to the previous one, as the slides lie.
  - Breaking: a `Button` that is a link (`href`, or an `<a>` as `component` or the `asChild` element) no longer gets `aria-pressed`, which the link role doesn't take and axe reports. `pressed` still applies the `.active` class; give the button `role="button"` for it to be announced as pressed.

- 2b36f91: `gap` of `Stack` takes an object per breakpoint, as its `direction` and every gap of `Flex` do: `gap={{ base: 'sm', md: 'lg' }}` renders `gap-sm md:gap-lg`. A plain value renders as before.

### Patch Changes

- 35c2817: `color` of `DataGrid` colors the grid. It rendered the color class alone, which no rule of the grid's stylesheet reads, so a colored grid looked like one with no color. The prop now renders `context` beside the color, on the grid and on its `footer`, and `style.css` maps the context colors onto the grid as `@chassis-ui/css` does for a table. A hovered row takes the header's background, which is opaque, so that a pinned cell never shows the cells scrolled under it.
- 0180b18: `DataGrid` no longer writes a `<style>` element for the shadow of its pinned columns. The HTML standard allows a `<style>` in `<body>` only with its rules in `@scope`, and an HTML validator reports the grid's markup since it checks that. The cells and the column header of the last `pin="start"` column and of the first `pin="end"` column now carry `datagrid-pin-cue-start` and `datagrid-pin-cue-end`, and `style.css` gives them the shadow while the grid is scrolled, from the same `--datagrid-pin-cue-shadow-start` and `--datagrid-pin-cue-shadow-end`. The grid loses the class made from `useId` (`datagrid-r…`) that scoped the generated rules.
- f4d0eea: `FloatingInput` ties its label, help and feedback to the field inside it. It generates the ids and a `TextInput`, `Select` or `Textarea` inside takes them: `<FloatingInput label="Email"><TextInput placeholder="…" /></FloatingInput>` needs no `ids`, no `id` and no `aria-labelledby`, and a `TextInput` or `Textarea` no longer prints react-aria's "If you do not provide a visible label" warning under a floating label. `ids` still replaces a generated id, and ids already repeated on the control keep working. A control that is not a field component of this library, such as a native `<input>`, still takes its ids through `ids` by hand; `FloatingInput` warns in development when no element has the id its label points at, in place of the warning about `ids` not being set.
- 06e84d0: A pressed link or button no longer gets an inline `outline` style. The library's document-level listener set `style="outline: none"` (`outline: medium` in Safari) on every focusable element at `pointerdown` and took it back on blur, on any element of the page, the library's own or not. In Safari, where a clicked button takes no focus and so never blurs, the style stayed for good and the button showed no focus ring when reached by keyboard later; in the other browsers it hid the ring a key press brings back to a clicked element.

  The outline is now suppressed only where a press would show a keyboard ring: on the pressed element when it takes focus and matches `:focus-visible`, which happens where react-aria focuses by script as the press starts (a `MenuToggle`, a calendar date). It is restored on blur or at the next key press, and an element that had no `style` attribute is left without one.

- 8a0f9d1: `color` of `Spinner` colors the spinner. It rendered `fg-{color}`, which sets the text color, and a spinner of `@chassis-ui/css` draws from `--cx-spinner-color`: every spinner stayed the default color. The prop now renders `spinner-{color}`, as a whole class name.
- 90455a7: `MenuSubmenuBack` goes back to the list without closing the menu. Its click reached the `autoClose` listener of `Menu` and `ContextMenu`, which read it as a click on an item and closed the whole menu; the click now stops at the back item, as a click on the submenu's trigger does. Closing a `stacked` submenu below the `sm` breakpoint, with the back item, ArrowLeft or Escape, returns focus to its trigger: the trigger was focused while `@chassis-ui/css` still hid it, so focus fell to the page.
- cbeecae: `color` of `Table` and `StaticTable` colors the table. It rendered the color class alone (`table primary`), and `@chassis-ui/css` colors a table through `.table.context`: the table looked like one with no color. The prop now renders `context` beside the color.
- 9fb97ff: `orientation="vertical"` of `Tabs` stacks the tabs. It set `aria-orientation` and the arrow keys only, so the list was announced as vertical, answered to the up and down keys, and was drawn as a row. The `TabList` now also gets the `flex-column` class. The panels stay below the list: lay out the root with `className`, for example `d-flex align-items-start gap-md`, to put them beside it.

## 0.4.1

### Patch Changes

- 6cf7c60: `size="sm"` of `Spinner` makes the spinner smaller. It rendered `spinner-border-sm` or `spinner-grow-sm`, which are not classes of `@chassis-ui/css`, so the prop had no effect in either build. It now renders `spinner-sm`, the class that sizes a spinner of both variants.
- 34837b5: A Tailwind build of `@chassis-ui/css` no longer loses the color and alignment classes of seven components. They built the class name from the prop at runtime (`` `bg-${color}` ``), which Tailwind's scanner cannot read, so the class rendered with no rule and nothing warned. Each prop now maps to whole class names:

  - `color` of `ProgressBar` and `Skeleton` (`bg-*`), of `Spinner` (`fg-*`), of `AlertIcon` (`icon-*`) and of `Link` (`link-*`);
  - `align` of `Placeholder` (`float-start`, `float-end`), of `Pagination` (`justify-content-*`), and of `Table`, `StaticTable` and `DataGrid` (`align-top`, `align-middle`, `align-bottom`).

  The markup of every value the props accept is the same as before. A value outside a prop's type, which rendered a class named after it, now renders none.

  Tailwind does not scan `node_modules`, so a Tailwind build has to register this package for the whole class names to be found: `@source "../node_modules/@chassis-ui/react/dist";` in the project's stylesheet, with the path from that file. The regular build of `@chassis-ui/css` needs nothing: it ships every class.

## 0.4.0

### Minor Changes

- daf128c: `Row` and `Col` are removed with the flexbox grid of `@chassis-ui/css` 0.7. `Grid` and `GridItem`
  take what the grid of css 0.7 adds: row counts as a class, the flow, end lines and the container
  breakpoints. The layout components have no `responsive` prop: each of their props takes its own
  value per breakpoint.

  Breaking: `@chassis-ui/css` 0.7 is required (the peer range is `>=0.7.0 <0.8.0`), and a project
  that compiles its Sass needs `@chassis-ui/tokens` 0.7. css 0.7 changes how a page looks with no
  change of markup: the gap of a grid with no `gap` is 1rem, and 1.5rem from `md`, where it went from
  0.5rem to 3rem; the padding of a `Container` is 1rem, and 1.5rem from `md`, where it was 0.75rem;
  subtle text is less faint, and the context colors of the dark theme are lighter. The changelog of
  `@chassis-ui/css` 0.7.0 has the full list.

  - Breaking: `Row`, `Col`, `RowProps` and `ColProps` are removed. They were deprecated in 0.3.0, and
    css 0.7 has none of the classes they rendered. The Grid page of the docs maps each of their props
    to `Grid` and `GridItem` (Migrating from Row/Col).
  - Breaking: the `responsive` prop of `Flex`, `Stack`, `Grid`, `GridItem`, `Card`, `CardBody`,
    `CardImage` and `Skeleton` is removed. Each prop it held takes the breakpoints itself: one value
    for every width, or an object with `base` for the narrowest width and a key per breakpoint.
    `<GridItem span="full" responsive={{ md: { span: 6 } }}>` is
    `<GridItem span={{ base: 'full', md: 6 }}>`,
    `<Flex direction="column" responsive={{ md: { direction: 'row', gap: 'md' } }}>` is
    `<Flex direction={{ base: 'column', md: 'row' }} gap={{ md: 'md' }}>`, and
    `<Stack direction="vertical" responsive={{ md: 'horizontal' }}>` is
    `<Stack direction={{ base: 'vertical', md: 'horizontal' }}>`. The classes they render are the
    same. With TypeScript, a `responsive` left behind is a type error; without it, the prop reaches
    the element as an attribute and the breakpoint classes are gone. The `Responsive` type is
    exported, and the `GridLayout` and `GridItemLayout` types are removed. `responsive` of `Table`,
    `StaticTable` and `Drawer` is another prop, and stays.
  - Breaking: `rows` of `Grid`, and of a `subgrid` `GridItem`, renders the `grid-rows-{n}` class for a
    count from 1 to 6, and sets `grid-template-rows` inline for any other. It set `--cx-grid-rows`,
    which css 0.7 removed, so on css 0.7 the prop of 0.3 does nothing. A grid with no `rows` no longer
    has one template row: its rows are as tall as their content. A grid nested in a grid with `rows`
    no longer takes that row count.
  - Breaking: `<Grid fill>` with no `min` wraps. Its columns are at least 12rem wide in css 0.7, where
    every child shared one row. Set `min` for another width.
  - Breaking: `start={13}` and `rowStart={7}` have no class in css 0.7, which stops the start lines
    at the last track. Place an item against the end edge with `end`: `span={3} end={13}`.
  - `GridItem` takes `end` and `rowEnd`, a line number or `'auto'` (`col-end-{n}`, `row-end-{n}`), for
    every width or per breakpoint.
  - `Grid` takes `flow`: `'row'`, `'column'`, `'dense'`, `'row-dense'` or `'column-dense'`, the values
    of CSS `grid-auto-flow`, rendered as the `grid-flow-*` classes. `flow="column"` fills the `rows`
    of a column before it starts the next. `flow` and `rows` take a value per breakpoint, as
    `columns` and `gap` do. The `GridFlow` type is exported.
  - The props of `Grid` and `GridItem` take the container keys `'@sm'` to `'@2xl'` beside the
    breakpoint keys: `span={{ '@md': 4 }}` renders `@md:col-span-4`, which follows
    the width of the nearest query container (an ancestor with the `contains-inline` class) where
    `md` follows the viewport. A container key wins over a breakpoint key where both apply. The
    `ContainerBreakpoint` type is exported.
  - `Grid` takes `contained` (the `contained` class): its default gutter and column count follow the
    query container too.
  - `Skeleton`: a `span` of `12` or `'auto'` at a breakpoint works. It renders `md:w-100` and
    `md:w-auto`, which css 0.7 has and css 0.6 lacked.

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
