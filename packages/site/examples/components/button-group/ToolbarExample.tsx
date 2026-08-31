import { Button, ButtonGroup, ButtonToolbar } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ButtonToolbar role="group" aria-label="Toolbar with button groups">
      <ButtonGroup className="me-small" role="group" aria-label="First group">
        <Button color="primary">1</Button>
        <Button color="primary">2</Button>
        <Button color="primary">3</Button>
        <Button color="primary">4</Button>
      </ButtonGroup>
      <ButtonGroup className="me-small" role="group" aria-label="Second group">
        <Button color="secondary">5</Button>
        <Button color="secondary">6</Button>
        <Button color="secondary">7</Button>
      </ButtonGroup>
      <ButtonGroup className="me-small" role="group" aria-label="Third group">
        <Button color="info">8</Button>
      </ButtonGroup>
    </ButtonToolbar>
  )
}
