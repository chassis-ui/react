import { useState } from 'react'
import { Time } from '@internationalized/date'
import { TimeField, type TimeFieldProps } from '@chassis-ui/react'

export const Example = () => {
  const [value, setValue] = useState<TimeFieldProps['value']>(new Time(14, 45))
  return (
    <TimeField
      help={`Current value: ${value ? value.toString() : 'empty'}`}
      label="Reminder"
      onChange={setValue}
      value={value}
    />
  )
}
