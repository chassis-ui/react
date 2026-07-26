import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const RadiosDisabledExample = () => {
  return (
    <CxFormRadioGroup label="Choose an option" defaultValue="checked">
      <CxFormRadio value="default" label="Disabled radio" disabled />
      <CxFormRadio value="checked" label="Disabled checked radio" disabled />
    </CxFormRadioGroup>
  )
}
