import { DateRangePicker } from '@chassis-ui/react'
import { getLocalTimeZone, startOfMonth, startOfWeek, today } from '@internationalized/date'

export const Example = () => {
  const now = today(getLocalTimeZone())

  const thisWeekStart = startOfWeek(now, 'en-US')
  const lastWeekEnd = thisWeekStart.subtract({ days: 1 })
  const lastWeekStart = startOfWeek(lastWeekEnd, 'en-US')

  const thisMonthStart = startOfMonth(now)
  const lastMonthEnd = thisMonthStart.subtract({ days: 1 })
  const lastMonthStart = startOfMonth(lastMonthEnd)

  const presets = [
    { label: 'Today', range: { start: now, end: now } },
    { label: 'Last 7 Days', range: { start: now.subtract({ days: 6 }), end: now } },
    { label: 'Last 30 Days', range: { start: now.subtract({ days: 29 }), end: now } },
    { label: 'Last 90 Days', range: { start: now.subtract({ days: 89 }), end: now } },
    { label: 'Last Week', range: { start: lastWeekStart, end: lastWeekEnd } },
    { label: 'Last Month', range: { start: lastMonthStart, end: lastMonthEnd } }
  ]

  return (
    <DateRangePicker aria-label="Trip dates" defaultValue={presets[1].range} presets={presets} />
  )
}
