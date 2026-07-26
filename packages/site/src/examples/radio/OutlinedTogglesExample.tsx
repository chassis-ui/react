import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const OutlinedTogglesExample = () => {
  return (
    <CxFormRadioGroup
      aria-label="Outlined radio toggle buttons"
      defaultValue="success-outlined"
      orientation="horizontal"
    >
      <CxFormRadio
        button={{ context: 'success', variant: 'outline' }}
        value="success-outlined"
        autoComplete="off"
        label="Radio"
      />
      <CxFormRadio
        button={{ context: 'danger', variant: 'outline' }}
        value="danger-outlined"
        autoComplete="off"
        label="Radio"
      />
    </CxFormRadioGroup>
  )
}
