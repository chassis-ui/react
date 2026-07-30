import { useState } from 'react'
import { CxTextarea } from '@chassis-ui/react'

export const Example = () => {
  const [value, setValue] = useState('')
  return (
    <CxTextarea
      label="Comment"
      help={`${value.length} characters`}
      value={value}
      onChange={setValue}
      placeholder="Leave a comment"
      aria-label="comment example"
    />
  )
}
