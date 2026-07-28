import { CxChipInput } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxChipInput
      label="Skills"
      help="Press Enter or , to add a skill."
      defaultValue={['React', 'CSS']}
      name="skills"
      placeholder="Add skill…"
    />
  )
}
