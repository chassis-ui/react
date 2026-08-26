import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container className="px-xlarge">
      <Row gutterX="xlarge">
        <Col>
          <div className="border p-medium text-center">Custom column padding</div>
        </Col>
        <Col>
          <div className="border p-medium text-center">Custom column padding</div>
        </Col>
      </Row>
    </Container>
  )
}
