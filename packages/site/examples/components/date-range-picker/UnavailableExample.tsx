import { DateRangePicker } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const Example = () => {
  const now = today(getLocalTimeZone())
  const unavailableDates = [now.add({ days: 2 }), now.add({ days: 5 })].map((date) =>
    date.toString()
  )

  return <DateRangePicker aria-label="Trip dates" unavailableDates={unavailableDates} />
}
