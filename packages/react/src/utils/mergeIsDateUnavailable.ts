import { DateValue } from 'react-stately'
import { toCalendarDate } from '@internationalized/date'

// `toString()` on a `CalendarDate` yields the same ISO 8601 `YYYY-MM-DD` string already used
// elsewhere for form submission (see `DatePicker`'s hidden input), so `unavailableDates` entries
// are expected in that same format. A calendar's cells are `CalendarDate`s, but the pickers also
// validate their own value with this, and with a time `granularity` that value's `toString()`
// carries the time (`2026-03-15T09:30:00`): it's reduced to its day first.
export const mergeIsDateUnavailable = (
  unavailableDates: string[] | undefined,
  isDateUnavailable: ((date: DateValue) => boolean) | undefined
): ((date: DateValue) => boolean) | undefined => {
  if (!unavailableDates?.length && !isDateUnavailable) return undefined

  const set = unavailableDates?.length ? new Set(unavailableDates) : null
  return (date) =>
    Boolean(set?.has(toCalendarDate(date).toString())) || Boolean(isDateUnavailable?.(date))
}
