import { NumberField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <NumberField
      defaultValue={1250.5}
      formatOptions={{ currency: 'EUR', style: 'currency' }}
      label="Price"
    />
    <NumberField
      defaultValue={0.15}
      formatOptions={{ style: 'percent' }}
      label="Discount"
      step={0.01}
    />
    <NumberField
      defaultValue={72}
      formatOptions={{ style: 'unit', unit: 'kilogram' }}
      label="Weight"
    />
  </>
)
