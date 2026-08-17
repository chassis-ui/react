import { Button } from '@chassis-ui/react'
import { COLORS } from '../../utils'

export const Example = () => {
  return (
    <>
      {COLORS.map((color) => (
        <Button key={color} color={color} variant="outline">
          {color}
        </Button>
      ))}
    </>
  )
}
