import { DatePicker } from '@chassis-ui/react'
import { parseZonedDateTime } from '@internationalized/date'

export const Example = () => {
  return (
    <DatePicker
      defaultValue={parseZonedDateTime('2026-11-05T09:30[Asia/Tokyo]')}
      label="Call with the Tokyo office"
    />
  )
}
