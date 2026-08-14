import { Radio, RadioGroup } from '@chassis-ui/react'

export const WithoutLabelExample = () => {
  return (
    <RadioGroup aria-label="Radio without a visible label" defaultValue="">
      <Radio value="" aria-label="..." />
    </RadioGroup>
  )
}
