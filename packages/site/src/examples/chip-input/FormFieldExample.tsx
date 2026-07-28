import { CxChipInput, CxFormLabel, CxFormHelp } from '@chassis-ui/react'

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
      <CxFormHelp>Press Enter or , to add a skill.</CxFormHelp>
    </div>
  )
}
