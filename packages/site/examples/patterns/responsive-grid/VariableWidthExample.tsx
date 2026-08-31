import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <div className="row medium:justify-content-center">
        <Col span responsive={{ large: { span: 2 } }}>
          1 of 3
        </Col>
        <Col responsive={{ medium: { span: 'auto' } }}>Variable width content</Col>
        <Col span responsive={{ large: { span: 2 } }}>
          3 of 3
        </Col>
      </div>
      <Row>
        <Col>1 of 3</Col>
        <Col responsive={{ medium: { span: 'auto' } }}>Variable width content</Col>
        <Col span responsive={{ large: { span: 2 } }}>
          3 of 3
        </Col>
      </Row>
    </Container>
  )
}
