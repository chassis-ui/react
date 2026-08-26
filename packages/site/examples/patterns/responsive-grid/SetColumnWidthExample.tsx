import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col>1 of 3</Col>
        <Col span={6}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
      </Row>
      <Row>
        <Col>1 of 3</Col>
        <Col span={6}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
      </Row>
    </Container>
  )
}
