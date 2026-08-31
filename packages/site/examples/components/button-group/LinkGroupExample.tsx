import { Button, ButtonGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ButtonGroup role="group" aria-label="Link group example">
      <Button href="#" color="primary" className="active">
        Active link
      </Button>
      <Button href="#" color="primary">
        Link
      </Button>
      <Button href="#" color="primary">
        Link
      </Button>
    </ButtonGroup>
  )
}
