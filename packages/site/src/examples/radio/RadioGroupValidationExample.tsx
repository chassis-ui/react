import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const RadioGroupValidationExample = () => {
  return (
    <CxFormRadioGroup
      label="Select a plan"
      invalid
      errorMessage="Please choose a plan to continue."
    >
      <CxFormRadio value="basic" label="Basic" />
      <CxFormRadio value="pro" label="Pro" />
    </CxFormRadioGroup>
  )
}
