import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row cols={2}>
        <Col>
          <div>Column content</div>
        </Col>
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
