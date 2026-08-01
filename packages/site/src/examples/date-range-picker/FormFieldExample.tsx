import { CxDateRangePicker } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxDateRangePicker
      label="Trip dates"
      help="We’ll send a reminder the day before you leave."
      name="tripDates"
    />
  )
}
