import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row
        cols={1}
        gutter="small"
        responsive={{ small: { cols: 2 }, medium: { cols: 4, gutter: '2xlarge' } }}
      >
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
