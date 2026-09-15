import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row gutter="sm">
        <Col span={6}>
          <div className="border p-md text-center">Custom column padding</div>
        </Col>
        <Col span={6}>
          <div className="border p-md text-center">Custom column padding</div>
        </Col>
        <Col span={6}>
          <div className="border p-md text-center">Custom column padding</div>
        </Col>
        <Col span={6}>
          <div className="border p-md text-center">Custom column padding</div>
        </Col>
      </Row>
    </Container>
  )
}
