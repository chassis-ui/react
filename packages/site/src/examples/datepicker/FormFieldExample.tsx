import { CxDatePicker } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxDatePicker
      label="Event date"
      help="We’ll send a reminder the day before."
      name="eventDate"
    />
  )
}
