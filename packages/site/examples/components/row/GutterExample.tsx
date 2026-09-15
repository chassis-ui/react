import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row gutter="xl">
        <Col>
          <div>Column content</div>
        </Col>
        <Col>
          <div>Column content</div>
        </Col>
        <Col>
          <div>Column content</div>
        </Col>
      </Row>
    </Container>
  )
}
