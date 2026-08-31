import { Badge } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Badge color="primary" size="small">
        Small
      </Badge>
      <Badge color="primary">Medium</Badge>
      <Badge color="primary" size="large">
        Large
      </Badge>
      <Badge color="primary" size="small" circle>
        2
      </Badge>
      <Badge color="primary" circle>
        2
      </Badge>
      <Badge color="primary" size="large" circle>
        2
      </Badge>
    </>
  )
}
