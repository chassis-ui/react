import { Badge } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Badge color="primary" size="sm">
        Small
      </Badge>
      <Badge color="primary">Medium</Badge>
      <Badge color="primary" size="lg">
        Large
      </Badge>
      <Badge color="primary" size="sm" circle>
        2
      </Badge>
      <Badge color="primary" circle>
        2
      </Badge>
      <Badge color="primary" size="lg" circle>
        2
      </Badge>
    </>
  )
}
