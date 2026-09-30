import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup aria-label="Radio toggle buttons" defaultValue="checked" orientation="horizontal">
      <Radio button={{ color: 'secondary' }} value="checked" label="Checked" />
      <Radio button={{ color: 'secondary' }} value="radio" label="Radio" />
      <Radio button={{ color: 'secondary' }} value="disabled" label="Radio" disabled />
      <Radio button={{ color: 'secondary' }} value="radio2" label="Radio" />
    </RadioGroup>
  )
}
