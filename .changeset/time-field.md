---
'@chassis-ui/react': minor
---

Add `TimeField`, a time of day on react-aria's `useTimeField`: one editable segment per unit, as
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
