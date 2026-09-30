---
'@chassis-ui/react': patch
---

`Calendar` and `RangeCalendar`, and the date pickers' calendars, no longer call a day "Today" in its
label in server-rendered HTML. react-aria writes "Today, …" into a cell's `aria-label` with the
server's date and time zone, and hydration doesn't patch attributes, so a statically built page
named its build day as today until the cell re-rendered. Until hydration a cell's label is now
react-aria's for a day that isn't today, in the same locale ("Thursday, October 1, 2026 selected");
once hydrated it is react-aria's own, "Today" included, on the same day the `datepicker-date-today`
class and `aria-current="date"` mark.
