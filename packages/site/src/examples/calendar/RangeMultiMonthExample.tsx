import { CxRangeCalendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const RangeMultiMonthExample = () => {
  const now = today(getLocalTimeZone())

  return (
    <CxRangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: now, end: now.add({ days: 10 }) }}
      visibleMonths={2}
    />
  )
}
