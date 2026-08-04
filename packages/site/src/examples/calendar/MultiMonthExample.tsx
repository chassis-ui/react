import { CxCalendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const MultiMonthExample = () => {
  const now = today(getLocalTimeZone())

  return <CxCalendar aria-label="Event date" defaultValue={now} visibleMonths={2} />
}
