import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col responsive={{ sm: { span: 8 } }}>sm:col-8</Col>
        <Col responsive={{ sm: { span: 4 } }}>sm:col-4</Col>
      </Row>
      <Row>
        <Col responsive={{ sm: { span: true } }}>col-sm</Col>
        <Col responsive={{ sm: { span: true } }}>col-sm</Col>
        <Col responsive={{ sm: { span: true } }}>col-sm</Col>
      </Row>
    </Container>
  )
}
