import React from 'react'
import { CxChipInput, CxFormLabel, CxFormText } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <div className="form-field">
      <CxFormLabel htmlFor="skillsInput">Skills</CxFormLabel>
      <CxChipInput
        defaultValue={['React', 'CSS']}
        id="skillsInput"
        name="skills"
        placeholder="Add skill…"
      />
      <CxFormText>Press Enter or , to add a skill.</CxFormText>
    </div>
  )
}
