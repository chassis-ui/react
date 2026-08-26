import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container className="overflow-hidden">
      <Row gutterY="xlarge">
        <Col span={6}>
          <div className="border p-medium text-center">Custom column padding</div>
        </Col>
        <Col span={6}>
          <div className="border p-medium text-center">Custom column padding</div>
        </Col>
        <Col span={6}>
          <div className="border p-medium text-center">Custom column padding</div>
        </Col>
        <Col span={6}>
          <div className="border p-medium text-center">Custom column padding</div>
        </Col>
      </Row>
    </Container>
  )
}
