import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup label="Options" defaultValue="option1" orientation="horizontal">
      <Radio value="option1" label="1" />
      <Radio value="option2" label="2" />
      <Radio value="option3" label="3 (disabled)" disabled />
    </RadioGroup>
  )
}
