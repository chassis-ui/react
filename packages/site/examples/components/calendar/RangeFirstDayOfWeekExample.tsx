import { RangeCalendar } from '@chassis-ui/react'
import { CalendarDate } from '@internationalized/date'

export const RangeFirstDayOfWeekExample = () => {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
      firstDayOfWeek="sun"
    />
  )
}
