import { DatePicker } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const MinMaxExample = () => {
  const now = today(getLocalTimeZone())

  return (
    <DatePicker aria-label="Appointment date" maxValue={now.add({ days: 30 })} minValue={now} />
  )
}
