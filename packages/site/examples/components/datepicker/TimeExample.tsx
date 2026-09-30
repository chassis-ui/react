import { DatePicker } from '@chassis-ui/react'

export const Example = () => {
  return (
    <DatePicker
      granularity="minute"
      help="Pick a day, then type the time."
      label="Appointment"
      name="appointment"
    />
  )
}
