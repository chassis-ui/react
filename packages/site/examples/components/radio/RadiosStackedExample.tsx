import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup label="Options" defaultValue="option1">
      <Radio value="option1" label="Default radio" />
      <Radio value="option2" label="Second default radio" />
      <Radio value="option3" label="Disabled radio" disabled />
    </RadioGroup>
  )
}
