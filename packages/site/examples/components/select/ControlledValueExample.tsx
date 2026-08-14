import { useState } from 'react'
import { Select } from '@chassis-ui/react'

export const Example = () => {
  const [value, setValue] = useState('js')
  const options = [
    { label: 'JavaScript', value: 'js' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' }
  ]
  const selection = options.find((o) => o.value === value)?.label || 'None'
  return (
    <Select
      aria-label="Controlled select example"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      help={`Current selection: ${selection}`}
      options={options}
    />
  )
}
