import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadiosInlineExample = () => {
  return (
    <CxRadioGroup label="Options" defaultValue="option1" orientation="horizontal">
      <CxRadio value="option1" label="1" />
      <CxRadio value="option2" label="2" />
      <CxRadio value="option3" label="3 (disabled)" disabled />
    </CxRadioGroup>
  )
}
