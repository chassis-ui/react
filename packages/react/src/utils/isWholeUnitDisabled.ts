import { CalendarState, RangeCalendarState } from 'react-stately'
import { CalendarDate, toCalendarDate } from '@internationalized/date'

// Shared by `CalendarMonthGrid` and `CalendarYearGrid` — a month/year button is disabled when
// every day it covers falls outside `minValue`/`maxValue`, not just when its first day does (e.g.
// a `maxValue` of March 15th still leaves March itself partly selectable, so March's button stays
// enabled; April's doesn't). `unitEnd` is the last day of the button's own month/year.
export const isWholeUnitDisabled = (
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState,
  unitStart: CalendarDate,
  unitEnd: CalendarDate
): boolean => {
  if (state.isDisabled) return true
  if (state.maxValue && unitStart.compare(toCalendarDate(state.maxValue)) > 0) return true
  if (state.minValue && unitEnd.compare(toCalendarDate(state.minValue)) < 0) return true
  return false
}
