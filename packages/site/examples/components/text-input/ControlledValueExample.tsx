import { useState } from 'react'
import { TextInput } from '@chassis-ui/react'

export const Example = () => {
  const [value, setValue] = useState('john@example.com')
  return (
    <TextInput
      type="email"
      value={value}
      onChange={setValue}
      aria-label="email example"
      help={`Current value: ${value}`}
    />
  )
}
