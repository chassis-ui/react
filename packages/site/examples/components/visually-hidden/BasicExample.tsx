import { Button, VisuallyHidden } from '@chassis-ui/react'

export const Example = () => (
  <Button color="primary">
    <span aria-hidden="true">★</span>
    <VisuallyHidden>Add to favorites</VisuallyHidden>
  </Button>
)
