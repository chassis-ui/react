import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadiosStackedExample = () => {
  return (
    <CxRadioGroup label="Options" defaultValue="option1">
      <CxRadio value="option1" label="Default radio" />
      <CxRadio value="option2" label="Second default radio" />
      <CxRadio value="option3" label="Disabled radio" disabled />
    </CxRadioGroup>
  )
}
