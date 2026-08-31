import { Button, Card, CardBody, CardImage, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card style={{ width: '18rem' }}>
      <CardImage orientation="top" src="https://placehold.co/800x400" />
      <CardBody>
        <CardTitle>Card title</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card's
          content.
        </CardText>
        <Button href="#">Go somewhere</Button>
      </CardBody>
    </Card>
  )
}
