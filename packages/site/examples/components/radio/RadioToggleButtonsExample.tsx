import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup aria-label="Radio toggle buttons" defaultValue="checked" orientation="horizontal">
      <Radio button={{ color: 'secondary' }} value="checked" autoComplete="off" label="Checked" />
      <Radio button={{ color: 'secondary' }} value="radio" autoComplete="off" label="Radio" />
      <Radio
        button={{ color: 'secondary' }}
        value="disabled"
        autoComplete="off"
        label="Radio"
        disabled
      />
      <Radio button={{ color: 'secondary' }} value="radio2" autoComplete="off" label="Radio" />
    </RadioGroup>
  )
}
