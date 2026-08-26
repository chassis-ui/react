import { DateRangePicker } from '@chassis-ui/react'

export const Example = () => {
  return (
    <DateRangePicker
      label="Trip dates"
      help="We’ll send a reminder the day before you leave."
      name="tripDates"
    />
  )
}
