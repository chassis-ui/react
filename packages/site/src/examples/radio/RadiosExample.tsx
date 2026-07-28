import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadiosExample = () => {
  return (
    <CxRadioGroup label="Choose an option" defaultValue="default">
      <CxRadio value="default" label="Default radio" />
      <CxRadio value="checked" label="Checked radio" />
    </CxRadioGroup>
  )
}
