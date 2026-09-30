import { CalendarDate, isSameDay, isToday } from '@internationalized/date'
import { useLocalizedStringFormatter } from 'react-aria'
import type { CalendarState, RangeCalendarState } from 'react-stately'

import { useHydrated } from '../portal/Portal'
import { todayLabelStrings } from './todayLabelStrings'

// Stands in for the date in a wrapper string, to split the wrapper around it.
const DATE = '\u0000'

interface CellToday {
  /** Whether the cell is marked as today: its class and `aria-current`. */
  isCurrentDate: boolean
  /** The cell button's `aria-label`. */
  label: string | undefined
}

// "Today" depends on the time zone, and a server's is rarely the viewer's, so a cell marks it only
// once hydration has finished. The zone is the calendar's, as in react-aria's label: a
// `ZonedDateTime` value's own, otherwise the browser's.
//
// That covers the label too, which `useCalendarCell` writes during render with no such guard
// ("Today, Thursday, October 1, 2026 selected"). Until hydration the cell's label is react-aria's
// for a day that isn't today: the "Today" wrapper taken off the label react-aria wrote, and, for a
// selected day, its "selected" wrapper put on instead. The wrappers come from the same strings
// react-aria formats with, a `LocalizedStringProvider`'s or else a copy of react-aria's own
// (`todayLabelStrings.ts`). What's inside the wrapper (a range's description, the date) and the
// first/last available date note after it stay react-aria's. Should react-aria's label ever not
// match those wrappers, it's left as it is.
export function useCellToday(
  date: CalendarDate,
  state: CalendarState<'single' | 'multiple'> | RangeCalendarState,
  isSelected: boolean,
  label: string | undefined
): CellToday {
  const hydrated = useHydrated()
  const strings = useLocalizedStringFormatter(todayLabelStrings, '@react-aria/calendar')
  const today = isToday(date, state.timeZone)
  if (hydrated || !today || !label) return { isCurrentDate: hydrated && today, label }

  const wrapper = strings.format(isSelected ? 'todayDateSelected' : 'todayDate', { date: DATE })
  const [before = '', after = ''] = wrapper.split(DATE)
  let note = ''
  if (state.minValue && isSameDay(date, state.minValue)) {
    note = `, ${strings.format('minimumDate')}`
  } else if (state.maxValue && isSameDay(date, state.maxValue)) {
    note = `, ${strings.format('maximumDate')}`
  }
  const end = label.length - after.length - note.length
  if (!label.startsWith(before) || !label.endsWith(after + note) || end < before.length) {
    return { isCurrentDate: false, label }
  }

  const inner = label.slice(before.length, end)
  return {
    isCurrentDate: false,
    label: (isSelected ? strings.format('dateSelected', { date: inner }) : inner) + note
  }
}
