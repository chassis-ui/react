import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container className="px-xl">
      <Row gutterX="xl">
        <Col>
          <div className="border p-md text-center">Custom column padding</div>
        </Col>
        <Col>
          <div className="border p-md text-center">Custom column padding</div>
        </Col>
      </Row>
    </Container>
  )
}
