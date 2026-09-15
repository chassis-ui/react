import { Card, CardBody, CardImage, CardText, CardTitle, Col } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card>
      <CardBody responsive={{ lg: 'row' }} gap="md">
        <Col responsive={{ lg: { span: 4 } }}>
          <CardImage src="https://placehold.co/800x400" />
        </Col>
        <Col responsive={{ lg: { span: 8 } }}>
          <CardBody className="p-0">
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
            <CardText className="mb-0">
              <sm className="fg-subtle">Last updated 3 mins ago</sm>
            </CardText>
          </CardBody>
        </Col>
      </CardBody>
    </Card>
  )
}
