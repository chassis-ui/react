import { Button, ButtonGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <ButtonGroup size="large" role="group" aria-label="Large button group">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <br />
      <ButtonGroup role="group" aria-label="Default button group">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <br />
      <ButtonGroup size="small" role="group" aria-label="Small button group">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    </>
  )
}
