import { Calendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const MultiMonthExample = () => {
  const now = today(getLocalTimeZone())

  return <Calendar aria-label="Event date" defaultValue={now} visibleMonths={2} />
}
