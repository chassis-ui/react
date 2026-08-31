import { Button, ButtonGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ButtonGroup role="group" aria-label="Basic mixed styles example">
      <Button color="danger">Left</Button>
      <Button color="warning">Middle</Button>
      <Button color="success">Right</Button>
    </ButtonGroup>
  )
}
