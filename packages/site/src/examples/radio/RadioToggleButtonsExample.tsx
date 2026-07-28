import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadioToggleButtonsExample = () => {
  return (
    <CxRadioGroup aria-label="Radio toggle buttons" defaultValue="checked" orientation="horizontal">
      <CxRadio
        button={{ context: 'secondary' }}
        value="checked"
        autoComplete="off"
        label="Checked"
      />
      <CxRadio button={{ context: 'secondary' }} value="radio" autoComplete="off" label="Radio" />
      <CxRadio
        button={{ context: 'secondary' }}
        value="disabled"
        autoComplete="off"
        label="Radio"
        disabled
      />
      <CxRadio button={{ context: 'secondary' }} value="radio2" autoComplete="off" label="Radio" />
    </CxRadioGroup>
  )
}
