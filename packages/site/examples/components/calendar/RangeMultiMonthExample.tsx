import { RangeCalendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const Example = () => {
  const now = today(getLocalTimeZone())

  return (
    <RangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: now, end: now.add({ days: 10 }) }}
      visibleMonths={2}
    />
  )
}
