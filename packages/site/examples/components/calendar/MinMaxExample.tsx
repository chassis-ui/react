import { Calendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const MinMaxExample = () => {
  const now = today(getLocalTimeZone())

  return <Calendar aria-label="Appointment date" maxValue={now.add({ days: 30 })} minValue={now} />
}
