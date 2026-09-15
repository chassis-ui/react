import { Card, CardBody, CardImage, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Card className="mb-md">
        <CardImage orientation="top" src="https://placehold.co/800x400" />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in to additional
            content. This content is a little bit longer.
          </CardText>
          <CardText>
            <sm className="md:text-emphasis">Last updated 3 mins ago</sm>
          </CardText>
        </CardBody>
      </Card>
      <Card className="mb-md">
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in to additional
            content. This content is a little bit longer.
          </CardText>
          <CardText>
            <sm className="md:text-emphasis">Last updated 3 mins ago</sm>
          </CardText>
        </CardBody>
        <CardImage orientation="bottom" src="https://placehold.co/800x400" />
      </Card>
    </>
  )
}
