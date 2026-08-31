import { useState } from 'react'
import { Chip } from '@chassis-ui/react'

export const Example = () => {
  const [pressed, setPressed] = useState(false)

  return (
    <Chip component="button" color="primary" pressed={pressed} onClick={() => setPressed(!pressed)}>
      In stock
    </Chip>
  )
}
