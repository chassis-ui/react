import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col order="last">Ordered last, first in the DOM</Col>
        <Col>Unordered, second in the DOM</Col>
        <Col order={2}>Order 2, third in the DOM</Col>
        <Col order="first">Ordered first, fourth in the DOM</Col>
      </Row>
    </Container>
  )
}
