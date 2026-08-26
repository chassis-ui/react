import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup label="Choose an option" defaultValue="default">
      <Radio value="default" label="Default radio" />
      <Radio value="checked" label="Checked radio" />
    </RadioGroup>
  )
}
