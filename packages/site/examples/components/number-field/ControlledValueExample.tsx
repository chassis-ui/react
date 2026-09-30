import { useState } from 'react'
import { NumberField } from '@chassis-ui/react'

export const Example = () => {
  const [value, setValue] = useState(3)
  return (
    <NumberField
      help={`Current value: ${isNaN(value) ? 'empty' : value}`}
      label="Guests"
      min={0}
      onChange={setValue}
      value={value}
    />
  )
}
