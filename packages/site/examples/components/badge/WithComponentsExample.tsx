import { Badge, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Button color="primary">
      Notifications{' '}
      <Badge color="secondary" circle role="status" aria-label="new notifications">
        2
      </Badge>
    </Button>
  )
}
