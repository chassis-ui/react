import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card style={{ width: '18rem' }}>
      <CardBody>
        <CardTitle>Card title</CardTitle>
        <CardSubtitle className="mb-medium medium:text-emphasis">Card subtitle</CardSubtitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card's
          content.
        </CardText>
        <CardText>
          <CardLink href="#">Card link</CardLink>
          <CardLink href="#">Another link</CardLink>
        </CardText>
      </CardBody>
    </Card>
  )
}
