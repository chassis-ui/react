---
'@chassis-ui/react': patch
---

Fixes in `Calendar`, `RangeCalendar`, `DatePicker` and `DateRangePicker`:

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
