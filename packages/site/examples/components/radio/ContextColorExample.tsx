import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup label="Success option" defaultValue="checkSuccess">
      <Radio color="success" value="checkSuccess" label="Success radio" />
    </RadioGroup>
  )
}
