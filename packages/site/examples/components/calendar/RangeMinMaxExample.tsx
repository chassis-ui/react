import { RangeCalendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const Example = () => {
  const now = today(getLocalTimeZone())

  return (
    <RangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: now, end: now.add({ days: 3 }) }}
      maxValue={now.add({ days: 30 })}
      minValue={now}
    />
  )
}
