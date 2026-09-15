---
'@chassis-ui/react': patch
---

Make every user-facing string the components render themselves translatable.

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
