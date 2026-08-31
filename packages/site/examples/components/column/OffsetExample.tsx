import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col span={4}>Not offset</Col>
        <Col span={4} offset={4}>
          Offset by four columns
        </Col>
      </Row>
    </Container>
  )
}
