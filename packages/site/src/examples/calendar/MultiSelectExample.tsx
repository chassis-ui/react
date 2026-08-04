import { CxCalendar } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const MultiSelectExample = () => {
  const now = today(getLocalTimeZone())

  return (
    <CxCalendar
      aria-label="Event dates"
      defaultValue={[now, now.add({ days: 5 }), now.add({ days: 12 })]}
      selectionMode="multiple"
    />
  )
}
