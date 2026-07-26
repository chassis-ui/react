import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const RadiosExample = () => {
  return (
    <CxFormRadioGroup label="Choose an option" defaultValue="default">
      <CxFormRadio value="default" label="Default radio" />
      <CxFormRadio value="checked" label="Checked radio" />
    </CxFormRadioGroup>
  )
}
