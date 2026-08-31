import { ChipInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ChipInput
      label="Skills"
      help="Press Enter or , to add a skill."
      defaultValue={['React', 'CSS']}
      name="skills"
      placeholder="Add skill…"
    />
  )
}
