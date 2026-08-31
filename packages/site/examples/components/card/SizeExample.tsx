import {
  Button,
  Card,
  CardBody,
  CardImage,
  CardSubtitle,
  CardText,
  CardTitle
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Card size="small" style={{ width: '16rem' }}>
        <CardImage orientation="top" src="https://placehold.co/800x400" />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardSubtitle>Card subtitle</CardSubtitle>
          <CardText>
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </CardText>
          <Button href="#" color="primary" className="me-auto">
            Go somewhere
          </Button>
        </CardBody>
      </Card>
      <Card size="large" style={{ width: '22rem' }}>
        <CardImage orientation="top" src="https://placehold.co/800x400" />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardSubtitle>Card subtitle</CardSubtitle>
          <CardText>
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </CardText>
          <Button href="#" color="primary" className="me-auto">
            Go somewhere
          </Button>
        </CardBody>
      </Card>
    </>
  )
}
