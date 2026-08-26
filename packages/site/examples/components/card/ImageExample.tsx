import { Card, CardBody, CardImage, CardText } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card style={{ width: '18rem' }}>
      <CardImage orientation="top" src="https://placehold.co/800x400" />
      <CardBody>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card's
          content.
        </CardText>
      </CardBody>
    </Card>
  )
}
