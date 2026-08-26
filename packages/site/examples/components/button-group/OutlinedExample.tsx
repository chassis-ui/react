import { Button, ButtonGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ButtonGroup role="group" aria-label="Basic outlined example">
      <Button color="primary" variant="outline">
        Left
      </Button>
      <Button color="primary" variant="outline">
        Middle
      </Button>
      <Button color="primary" variant="outline">
        Right
      </Button>
    </ButtonGroup>
  )
}
