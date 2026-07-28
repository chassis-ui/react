import { CxDatePicker, CxFormLabel, CxFormHelp } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <div className="form-field">
      <CxFormLabel htmlFor="eventDate">Event date</CxFormLabel>
      <CxDatePicker id="eventDate" name="eventDate" />
      <CxFormHelp>We’ll send a reminder the day before.</CxFormHelp>
    </div>
  )
}
