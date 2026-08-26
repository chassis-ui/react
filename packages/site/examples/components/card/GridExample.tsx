import { Button, Card, CardBody, CardText, CardTitle, Col, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Row>
      <Col responsive={{ small: { span: 6 } }}>
        <Card>
          <CardBody>
            <CardTitle>Special title treatment</CardTitle>
            <CardText>
              With supporting text below as a natural lead-in to additional content.
            </CardText>
            <Button href="#">Go somewhere</Button>
          </CardBody>
        </Card>
      </Col>
      <Col responsive={{ small: { span: 6 } }}>
        <Card>
          <CardBody>
            <CardTitle>Special title treatment</CardTitle>
            <CardText>
              With supporting text below as a natural lead-in to additional content.
            </CardText>
            <Button href="#">Go somewhere</Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}
