---
'@chassis-ui/react': patch
---

Fix what server-rendered HTML shows before the page hydrates. Each component now renders on the
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
