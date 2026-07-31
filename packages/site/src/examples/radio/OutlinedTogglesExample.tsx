import { CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const OutlinedTogglesExample = () => {
  return (
    <CxRadioGroup
      aria-label="Outlined radio toggle buttons"
      defaultValue="success-outlined"
      orientation="horizontal"
    >
      <CxRadio
        button={{ color: 'success', variant: 'outline' }}
        value="success-outlined"
        autoComplete="off"
        label="Radio"
      />
      <CxRadio
        button={{ color: 'danger', variant: 'outline' }}
        value="danger-outlined"
        autoComplete="off"
        label="Radio"
      />
    </CxRadioGroup>
  )
}
