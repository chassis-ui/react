import { CxCalendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const MinMaxExample = () => {
  const now = today(getLocalTimeZone())

  return (
    <CxCalendar aria-label="Appointment date" maxValue={now.add({ days: 30 })} minValue={now} />
  )
}
