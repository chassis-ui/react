import { CxCalendar } from '@chassis-ui/react'
import { isWeekend } from '@internationalized/date'

export const UnavailableExample = () => {
  return (
    <CxCalendar
      aria-label="Appointment date"
      isDateUnavailable={(date) => isWeekend(date, 'en-US')}
    />
  )
}
