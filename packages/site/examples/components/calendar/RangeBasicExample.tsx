import { RangeCalendar } from '@chassis-ui/react'
import { CalendarDate } from '@internationalized/date'

export const Example = () => {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
    />
  )
}
