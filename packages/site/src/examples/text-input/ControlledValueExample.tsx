import { useState } from 'react'
import { CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  const [value, setValue] = useState('john@example.com')
  return (
    <CxTextInput
      type="email"
      value={value}
      onChange={setValue}
      aria-label="email example"
      help={`Current value: ${value}`}
    />
  )
}
