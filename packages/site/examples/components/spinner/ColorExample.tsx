import { Spinner } from '@chassis-ui/react'
import { COLORS } from '../../utils'

export const Example = () => {
  return (
    <>
      {COLORS.map((color) => (
        <Spinner key={color} color={color} visuallyHiddenLabel={`Loading, ${color}`} />
      ))}
    </>
  )
}
