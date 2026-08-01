import { CxDateRangePicker } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const MinMaxExample = () => {
  const now = today(getLocalTimeZone())

  return (
    <CxDateRangePicker aria-label="Trip dates" maxValue={now.add({ days: 60 })} minValue={now} />
  )
}
