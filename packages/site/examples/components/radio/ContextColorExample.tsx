import { Radio, RadioGroup } from '@chassis-ui/react'

export const ContextColorExample = () => {
  return (
    <RadioGroup label="Success option" defaultValue="checkSuccess">
      <Radio color="success" value="checkSuccess" label="Success radio" />
    </RadioGroup>
  )
}
