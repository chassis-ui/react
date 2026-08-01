import { CxRangeCalendar } from '@chassis-ui/react'
import { CalendarDate } from '@internationalized/date'

export const RangeNavigationExample = () => {
  return (
    <CxRangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
      navigation="arrows"
    />
  )
}
