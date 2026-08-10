import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col responsive={{ medium: { span: 4, order: 2 } }}>
          Full width below medium, then one-third width, ordered second
        </Col>
        <Col responsive={{ medium: { span: 4, offset: 4, order: 1 } }}>
          Full width below medium, then one-third width offset by four columns, ordered first
        </Col>
      </Row>
    </Container>
  )
}
