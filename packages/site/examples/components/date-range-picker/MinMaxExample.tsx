import { DateRangePicker } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const Example = () => {
  const now = today(getLocalTimeZone())

  return <DateRangePicker aria-label="Trip dates" maxValue={now.add({ days: 60 })} minValue={now} />
}
