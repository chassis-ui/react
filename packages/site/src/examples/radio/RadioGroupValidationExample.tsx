import { Radio, RadioGroup } from '@chassis-ui/react'

export const RadioGroupValidationExample = () => {
  return (
    <RadioGroup label="Select a plan" invalid errorMessage="Please choose a plan to continue.">
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
    </RadioGroup>
  )
}
