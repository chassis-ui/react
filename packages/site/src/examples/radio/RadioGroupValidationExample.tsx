import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadioGroupValidationExample = () => {
  return (
    <CxRadioGroup label="Select a plan" invalid errorMessage="Please choose a plan to continue.">
      <CxRadio value="basic" label="Basic" />
      <CxRadio value="pro" label="Pro" />
    </CxRadioGroup>
  )
}
