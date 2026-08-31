import { useState } from 'react'
import { Button } from '@chassis-ui/react'

export const Example = () => {
  const [pressed, setPressed] = useState(false)

  return (
    <Button color="primary" pressed={pressed} onClick={() => setPressed(!pressed)}>
      Bold
    </Button>
  )
}
