import { Stepper } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Stepper
      items={[
        { label: 'Account' },
        { label: 'Shipping' },
        { label: 'Payment', active: true },
        { label: 'Review' }
      ]}
    />
  )
}
