import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col>First in the DOM, no order set</Col>
        <Col order={5}>Second in the DOM, order 5</Col>
        <Col order={1}>Third in the DOM, order 1</Col>
      </Row>
    </Container>
  )
}
