import { Col, Container, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Container>
      <Row>
        <Col responsive={{ medium: { span: 8 } }}>.medium:col-8</Col>
        <Col span={6} responsive={{ medium: { span: 4 } }}>
          .col-6 .medium:col-4
        </Col>
      </Row>
      <Row>
        <Col span={6} responsive={{ medium: { span: 4 } }}>
          .col-6 .medium:col-4
        </Col>
        <Col span={6} responsive={{ medium: { span: 4 } }}>
          .col-6 .medium:col-4
        </Col>
        <Col span={6} responsive={{ medium: { span: 4 } }}>
          .col-6 .medium:col-4
        </Col>
      </Row>
      <Row>
        <Col span={6}>.col-6</Col>
        <Col span={6}>.col-6</Col>
      </Row>
    </Container>
  )
}
