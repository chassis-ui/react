import { Radio, RadioGroup } from '@chassis-ui/react'

export const RadiosDisabledExample = () => {
  return (
    <RadioGroup label="Choose an option" defaultValue="checked">
      <Radio value="default" label="Disabled radio" disabled />
      <Radio value="checked" label="Disabled checked radio" disabled />
    </RadioGroup>
  )
}
