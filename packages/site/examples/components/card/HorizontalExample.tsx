import { Card, CardBody, CardImage, CardText, CardTitle, Col } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card responsive={{ large: 'row' }}>
      <Col responsive={{ large: { span: 4 } }}>
        <CardImage
          orientation="top"
          responsive={{ large: 'start' }}
          src="https://placehold.co/800x400"
          style={{ height: '100%', objectFit: 'cover' }}
        />
      </Col>
      <Col responsive={{ large: { span: 8 } }}>
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in to additional
            content. This content is a little bit longer.
          </CardText>
          <CardText>
            <small className="fg-subtle">Last updated 3 mins ago</small>
          </CardText>
        </CardBody>
      </Col>
    </Card>
  )
}
