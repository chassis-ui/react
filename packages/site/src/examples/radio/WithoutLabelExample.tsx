import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const WithoutLabelExample = () => {
  return (
    <CxRadioGroup aria-label="Radio without a visible label" defaultValue="">
      <CxRadio value="" aria-label="..." />
    </CxRadioGroup>
  )
}
