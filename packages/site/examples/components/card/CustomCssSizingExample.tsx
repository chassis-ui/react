import { Button, Card, CardBody, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card style={{ width: '18rem' }}>
      <CardBody>
        <CardTitle>Special title treatment</CardTitle>
        <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
        <Button href="#">Go somewhere</Button>
      </CardBody>
    </Card>
  )
}
