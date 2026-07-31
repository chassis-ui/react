import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadioToggleButtonsExample = () => {
  return (
    <CxRadioGroup aria-label="Radio toggle buttons" defaultValue="checked" orientation="horizontal">
      <CxRadio button={{ color: 'secondary' }} value="checked" autoComplete="off" label="Checked" />
      <CxRadio button={{ color: 'secondary' }} value="radio" autoComplete="off" label="Radio" />
      <CxRadio
        button={{ color: 'secondary' }}
        value="disabled"
        autoComplete="off"
        label="Radio"
        disabled
      />
      <CxRadio button={{ color: 'secondary' }} value="radio2" autoComplete="off" label="Radio" />
    </CxRadioGroup>
  )
}
