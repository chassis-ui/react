import { Badge, Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Button color="primary">
      Profile{' '}
      <Badge color="secondary" role="status" aria-label="unread messages">
        9
      </Badge>
    </Button>
  )
}
