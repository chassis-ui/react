import { Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup
      aria-label="Outlined radio toggle buttons"
      defaultValue="success-outlined"
      orientation="horizontal"
    >
      <Radio
        button={{ color: 'success', variant: 'outline' }}
        value="success-outlined"
        autoComplete="off"
        label="Radio"
      />
      <Radio
        button={{ color: 'danger', variant: 'outline' }}
        value="danger-outlined"
        autoComplete="off"
        label="Radio"
      />
    </RadioGroup>
  )
}
