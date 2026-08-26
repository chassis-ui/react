import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col responsive={{ small: { span: 8 } }}>small:col-8</Col>
        <Col responsive={{ small: { span: 4 } }}>small:col-4</Col>
      </Row>
      <Row>
        <Col responsive={{ small: { span: true } }}>col-small</Col>
        <Col responsive={{ small: { span: true } }}>col-small</Col>
        <Col responsive={{ small: { span: true } }}>col-small</Col>
      </Row>
    </Container>
  )
}
