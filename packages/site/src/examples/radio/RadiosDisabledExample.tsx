import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadiosDisabledExample = () => {
  return (
    <CxRadioGroup label="Choose an option" defaultValue="checked">
      <CxRadio value="default" label="Disabled radio" disabled />
      <CxRadio value="checked" label="Disabled checked radio" disabled />
    </CxRadioGroup>
  )
}
