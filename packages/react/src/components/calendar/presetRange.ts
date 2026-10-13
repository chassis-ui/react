import { RangeValue } from 'react-aria'
import { DateValue } from 'react-stately'
import { Calendar, CalendarDate, toCalendar, toCalendarDate } from '@internationalized/date'

// The day `date` on `like`: in its calendar, and with its time and zone when it has them.
const onDayOf = (like: DateValue, date: CalendarDate): DateValue => {
  const day = toCalendar(date, like.calendar)
  return 'hour' in like
    ? like.set({ day: day.day, era: day.era, month: day.month, year: day.year })
    : day
}

// A preset's range as a range picked in the grid would come out. react-stately's `selectDate`
// puts the two days in order, keeps them inside `minValue`/`maxValue`, and returns them in the
// calendar of the current value with that value's times; `state.setValue` does none of it, so a
// preset could commit a reversed range, days no cell allows, and plain dates over a value that
// has times. With no current value the preset's own dates set the calendar and the times.
//
// `null` when the grid has no way to that range, and the preset is disabled:
//
// - No day of it is inside `minValue`/`maxValue`: there is nothing to select.
// - A day of it, inside those limits, is unavailable. A range in the grid is contiguous (this
//   package doesn't pass react-stately's `allowsNonContiguousRanges`): with the start picked,
//   the cells from the next unavailable day on are disabled, so no second press reaches the
//   preset's end. The range isn't cut short at that day instead, as it is at a limit: the days
//   left would be whichever came before the first gap, not what the preset's label says.
//   `isDateUnavailable` is asked about each day as the grid asks, in `calendar`.
export const normalizePresetRange = (
  range: RangeValue<DateValue>,
  value: RangeValue<DateValue> | null,
  minValue?: DateValue | null,
  maxValue?: DateValue | null,
  isDateUnavailable?: (date: DateValue) => boolean,
  calendar?: Calendar
): RangeValue<DateValue> | null => {
  const [first, last] =
    range.end.compare(range.start) < 0 ? [range.end, range.start] : [range.start, range.end]
  let start = toCalendarDate(first)
  let end = toCalendarDate(last)
  const min = minValue ? toCalendarDate(minValue) : null
  const max = maxValue ? toCalendarDate(maxValue) : null
  if ((min && end.compare(min) < 0) || (max && start.compare(max) > 0)) return null
  if (min && start.compare(min) < 0) start = min
  if (max && end.compare(max) > 0) end = max
  if (isDateUnavailable) {
    for (let day = start; day.compare(end) <= 0; day = day.add({ days: 1 })) {
      if (isDateUnavailable(calendar ? toCalendar(day, calendar) : day)) return null
    }
  }
  return {
    end: onDayOf(value?.end ?? last, end),
    start: onDayOf(value?.start ?? first, start)
  }
}
