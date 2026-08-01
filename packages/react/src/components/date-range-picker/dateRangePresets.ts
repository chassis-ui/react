import { DateValue, RangeValue } from 'react-aria'
import { getLocalTimeZone, startOfMonth, startOfWeek, today } from '@internationalized/date'

export interface CxDateRangePreset {
  label: string
  range: RangeValue<DateValue>
}

// Order matches the reference design: recent fixed-length windows first, then the two most
// recent complete calendar periods. All relative to "today" at render time — never baked in.
export const getDefaultDateRangePresets = (locale: string): CxDateRangePreset[] => {
  const now = today(getLocalTimeZone())

  const thisWeekStart = startOfWeek(now, locale)
  const lastWeekEnd = thisWeekStart.subtract({ days: 1 })
  const lastWeekStart = startOfWeek(lastWeekEnd, locale)

  const thisMonthStart = startOfMonth(now)
  const lastMonthEnd = thisMonthStart.subtract({ days: 1 })
  const lastMonthStart = startOfMonth(lastMonthEnd)

  return [
    { label: 'Today', range: { start: now, end: now } },
    { label: 'Last 7 Days', range: { start: now.subtract({ days: 6 }), end: now } },
    { label: 'Last 30 Days', range: { start: now.subtract({ days: 29 }), end: now } },
    { label: 'Last 90 Days', range: { start: now.subtract({ days: 89 }), end: now } },
    { label: 'Last Week', range: { start: lastWeekStart, end: lastWeekEnd } },
    { label: 'Last Month', range: { start: lastMonthStart, end: lastMonthEnd } }
  ]
}
