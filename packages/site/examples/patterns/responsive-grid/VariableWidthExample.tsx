import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <div className="row md:justify-content-center">
        <Col span responsive={{ lg: { span: 2 } }}>
          1 of 3
        </Col>
        <Col responsive={{ md: { span: 'auto' } }}>Variable width content</Col>
        <Col span responsive={{ lg: { span: 2 } }}>
          3 of 3
        </Col>
      </div>
      <Row>
        <Col>1 of 3</Col>
        <Col responsive={{ md: { span: 'auto' } }}>Variable width content</Col>
        <Col span responsive={{ lg: { span: 2 } }}>
          3 of 3
        </Col>
      </Row>
    </Container>
  )
}
