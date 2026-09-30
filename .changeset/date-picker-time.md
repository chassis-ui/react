---
'@chassis-ui/react': minor
---

`DatePicker` and `DateRangePicker` take a time: `granularity` (`day`, `hour`, `minute`, `second`)
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
