---
'@chassis-ui/react': patch
---

A `Calendar` or `RangeCalendar` given an `aria-label` keeps the name react-aria composes for it with the visible month: `aria-label="Event date"` names the widget "Event date, March 2024" again, as a screen reader announces on entering it. The raw prop was spread after react-aria's and replaced that name with "Event date" alone.
