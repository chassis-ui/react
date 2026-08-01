import { CxRangeCalendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const RangeMinMaxExample = () => {
  const now = today(getLocalTimeZone())

  return (
    <CxRangeCalendar
      aria-label="Trip dates"
      defaultValue={{ start: now, end: now.add({ days: 3 }) }}
      maxValue={now.add({ days: 30 })}
      minValue={now}
    />
  )
}
