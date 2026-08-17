import { Link } from '@chassis-ui/react'
import { COLORS } from '../../utils'

export const Example = () => {
  return (
    <>
      {COLORS.map((color) => (
        <p key={color}>
          <Link href="#" color={color}>
            {color} link
          </Link>
        </p>
      ))}
    </>
  )
}
