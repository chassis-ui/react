import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup aria-label="Radio without a visible label" defaultValue="">
      <Radio value="" aria-label="..." />
    </RadioGroup>
  )
}
