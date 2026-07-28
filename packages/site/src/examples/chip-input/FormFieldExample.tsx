import { CxChipInput, CxFormField } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxFormField
      label="Skills"
      help="Press Enter or , to add a skill."
      ids={{ input: 'skillsInput' }}
    >
      <CxChipInput
        defaultValue={['React', 'CSS']}
        id="skillsInput"
        name="skills"
        placeholder="Add skill…"
      />
    </CxFormField>
  )
}
