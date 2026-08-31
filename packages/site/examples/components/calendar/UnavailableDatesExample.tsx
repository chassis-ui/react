import { Calendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const Example = () => {
  const now = today(getLocalTimeZone())
  const unavailableDates = [now.add({ days: 2 }), now.add({ days: 5 }), now.add({ days: 9 })].map(
    (date) => date.toString()
  )

  return <Calendar aria-label="Appointment date" unavailableDates={unavailableDates} />
}
