import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col>col</Col>
        <Col>col</Col>
        <Col>col</Col>
        <Col>col</Col>
      </Row>
      <Row>
        <Col span={8}>col-8</Col>
        <Col span={4}>col-4</Col>
      </Row>
    </Container>
  )
}
