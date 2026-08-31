import { DateValue } from 'react-stately'

// `date.toString()` on a `CalendarDate` (the only `DateValue` variant `Calendar`/`DatePicker`
// ever produce — both are date-only, no time segments) yields the same ISO 8601 `YYYY-MM-DD`
// string already used elsewhere for form submission (see `DatePicker`'s hidden input), so
// `unavailableDates` entries are expected in that same format.
export const mergeIsDateUnavailable = (
  unavailableDates: string[] | undefined,
  isDateUnavailable: ((date: DateValue) => boolean) | undefined
): ((date: DateValue) => boolean) | undefined => {
  if (!unavailableDates?.length && !isDateUnavailable) return undefined

  const set = unavailableDates?.length ? new Set(unavailableDates) : null
  return (date) => Boolean(set?.has(date.toString())) || Boolean(isDateUnavailable?.(date))
}
