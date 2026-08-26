import { Calendar } from '@chassis-ui/react'
import { isWeekend } from '@internationalized/date'

export const Example = () => {
  return (
    <Calendar
      aria-label="Appointment date"
      isDateUnavailable={(date) => isWeekend(date, 'en-US')}
    />
  )
}
