import { Card, CardBody, CardImage, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Card className="mb-medium">
        <CardImage orientation="top" src="https://placehold.co/800x400" />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in to additional
            content. This content is a little bit longer.
          </CardText>
          <CardText>
            <small className="medium:text-emphasis">Last updated 3 mins ago</small>
          </CardText>
        </CardBody>
      </Card>
      <Card className="mb-medium">
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in to additional
            content. This content is a little bit longer.
          </CardText>
          <CardText>
            <small className="medium:text-emphasis">Last updated 3 mins ago</small>
          </CardText>
        </CardBody>
        <CardImage orientation="bottom" src="https://placehold.co/800x400" />
      </Card>
    </>
  )
}
