import React from 'react'
import { CxDatePicker, CxFormLabel, CxFormText } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <div className="form-field">
      <CxFormLabel htmlFor="eventDate">Event date</CxFormLabel>
      <CxDatePicker id="eventDate" name="eventDate" />
      <CxFormText>We’ll send a reminder the day before.</CxFormText>
    </div>
  )
}
