import { Chip } from '@chassis-ui/react'
import { COLORS } from '../../utils'

export const Example = () => {
  return (
    <>
      {COLORS.map((color) => (
        <Chip key={color} color={color} variant="outline">
          {color}
        </Chip>
      ))}
    </>
  )
}
