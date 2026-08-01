import { CxDateRangePicker } from '@chassis-ui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

export const CustomPresetsExample = () => {
  const now = today(getLocalTimeZone())

  return (
    <CxDateRangePicker
      aria-label="Trip dates"
      presets={[
        { label: 'This weekend', range: { start: now, end: now.add({ days: 1 }) } },
        { label: 'Next week', range: { start: now.add({ days: 7 }), end: now.add({ days: 13 }) } }
      ]}
    />
  )
}
