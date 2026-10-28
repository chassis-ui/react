---
'@chassis-ui/react': patch
---

`DatePicker` and `DateRangePicker` now portal their calendar popover, as `Combobox`, `Autocomplete` and `Popover` portal their panels: to `document.body`, or into the open `<dialog>` the picker is in. Rendered in place, the calendar was clipped by any ancestor that scrolls (an `overflow: auto` box, a `table-responsive`, a scrolling card or dialog body), and that ancestor scrolled instead of the calendar covering what is under it. The `.datepicker` popover is no longer a sibling of the field in the DOM, and a picker rendered open sends no calendar in its server HTML: it appears once the page has hydrated.

The segments of `DatePicker`, `DateRangePicker` and `TimeField` sit closer together: each pads its sides by `--cx-space-4xs` instead of `--cx-space-3xs`, so a time reads `9:30 PM` rather than `9 : 30 PM`. The dash between the two dates of a `DateRangePicker` is spaced by `--cx-space-xs` instead of `--cx-gap`.
