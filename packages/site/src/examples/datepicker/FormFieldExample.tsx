import { CxDatePicker, CxFormField } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxFormField
      label="Event date"
      help="We’ll send a reminder the day before."
      ids={{ input: 'eventDate' }}
    >
      <CxDatePicker id="eventDate" name="eventDate" />
    </CxFormField>
  )
}
