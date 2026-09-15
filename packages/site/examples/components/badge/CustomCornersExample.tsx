import { Badge } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Badge color="primary" className="rounded-zero">
        Sharp
      </Badge>
      <Badge color="primary" className="rounded-sm">
        Blunt
      </Badge>
      <Badge color="primary" className="rounded-md">
        Soft
      </Badge>
      <Badge color="primary" className="rounded-full">
        Pill
      </Badge>
    </>
  )
}
