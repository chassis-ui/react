import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col responsive={{ small: { span: 'auto' } }}>One of three columns</Col>
        <Col responsive={{ small: { span: 'auto' } }}>One of three columns</Col>
        <Col responsive={{ small: { span: 'auto' } }}>One of three columns</Col>
      </Row>
    </Container>
  )
}
